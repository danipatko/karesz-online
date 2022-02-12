import {
    KareszMap,
    Field,
    FIELD_VALUES,
    Karesz,
    Rotation,
    State,
} from '../core/types';
import KareszRunner from '../core/run';
import { Socket } from 'socket.io';

interface Player {
    socket: Socket;
    ready: boolean;
    id: string;
    name: string;
    code: string;
    spectator: boolean;
}

enum SessionState {
    waiting = 0, // on finished/initted, wait for people to write their code
    compiling = 1, // on host start, compile
    running = 2, // on compile finished
}

export default class SessionManager {
    private map: KareszMap | undefined;
    protected players: Map<string, Player> = new Map<string, Player>();
    protected state: SessionState = SessionState.waiting;
    protected host: string;
    public destroy: () => void;

    constructor({
        name,
        socket,
        remove,
    }: {
        socket: Socket;
        name: string;
        remove: () => void;
    }) {
        this.host = socket.id;
        this.destroy = remove;
        this.addPlayer({ name, socket, host: true });
    }

    private setHost(id: string) {
        const host = this.players.get(id);
        if (host === undefined) return;

        this.host = id;
        // handle host leaving (find new host or delete session)
        host.socket.on('disconnect', () => {
            this.players.delete(host.socket.id);
            if (this.players.size === 0) this.destroy();

            this.announce('left', { id: host.socket.id });
            this.host = this.players.keys().next().value;
            this.announce('host_change', { host: this.host });
        });
    }

    /**
     * Emit an event for every player
     */
    private announce(
        ev:
            | 'left'
            | 'joined'
            | 'update_player'
            | 'update_env'
            | 'results'
            | 'host_change',
        params?: object
    ): void {
        this.players.forEach((x) => x.socket.emit(ev, { ...params }));
    }

    /**
     * fill map with empty fields
     */
    private fillMap({ x, y }: { x: number; y: number }): void {
        this.map = {
            sizeX: x,
            sizeY: y,
            matrix: Array(x)
                .fill(Field.empty)
                .map(() => Array(y).fill(Field.empty)),
        };
    }

    /**
     * Parse a string as a matrix.
     */
    private parseMapAsString(s: string, separator: string = '\n'): void {
        if (this.map === undefined) return;

        this.map.matrix = s
            .split(separator)
            .map((x) =>
                x.split('').map((x) => FIELD_VALUES[parseInt(x)] ?? Field.empty)
            );
    }

    /**
     * Get karesz objects from players
     */
    private getKareszes({
        x,
        y,
    }: {
        x: number;
        y: number;
    }): Map<number, Karesz> {
        const map = new Map<number, Karesz>(),
            gap = Math.floor(x / (this.players.size + 1));
        let i = 0;
        this.players.forEach((player) => {
            const startState: State = {
                position: { x: (i + 1) * gap, y: Math.floor(y / 2) },
                rotation: Rotation.up,
            };
            map.set(i++, {
                name: player.name,
                startState,
                steps: '',
                ...startState,
            });
        });
        return map;
    }

    /**
     * Append a new player.
     * @returns the index of the current player
     */
    public addPlayer({
        name,
        socket,
        host,
    }: {
        name: string;
        socket: Socket;
        host: boolean;
    }): void {
        const player: Player = {
            name,
            socket,
            id: socket.id,
            ready: false,
            code: '',
            spectator: this.state !== SessionState.waiting,
        };

        // handle user submitting code
        socket.on('submit', ({ code }: { code: string }) => {
            const p = this.players.get(socket.id);
            if (p !== undefined) this.players.set(p.id, { ...p, code });
        });

        this.players.set(player.id, player);
        this.announce('joined', { name: player.name, ready: false });
    }

    /**
     * Remove a player by it's index
     */
    public removePlayer(id: string): void {
        const player = this.players.get(id);
        this.players.delete(id);
        this.announce('left', { name: player?.name });
    }

    /**
     * Start the game
     */
    public async startGame({
        map,
        mapType,
        mapSize,
    }: {
        map?: string;
        mapType: 'parse' | 'empty' | 'load';
        mapSize?: { x: number; y: number };
    }): Promise<{ error?: string; output: string; exitCode: number }> {
        switch (mapType) {
            // create an empty map of size ...
            case 'empty':
                this.fillMap({ ...(mapSize ?? { x: 10, y: 10 }) });
            // parse map made by user ...
            case 'parse':
                if (map !== undefined) this.parseMapAsString(map);
            // load an existing map
            case 'load':
                break;
        }
        // create new runner instance
        const game = new KareszRunner(
            'csharp',
            this.getKareszes({ ...(mapSize ?? { x: 10, y: 10 }) }),
            this.map
        );

        const code = new Map<number, string>();
        let i = 0;
        this.players.forEach((player) => code.set(i++, player.code));
        return await game.run({ code });
    }
}
