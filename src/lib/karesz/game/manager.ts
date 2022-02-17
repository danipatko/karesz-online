import {
    KareszMap,
    Field,
    FIELD_VALUES,
    Karesz,
    Rotation,
    State,
    SessionState,
} from '../core/types';
import KareszRunner from '../core/run';
import { Socket } from 'socket.io';

interface Player {
    socket: Socket;
    ready: boolean;
    id: string;
    name: string;
    code: string;
    disqualified: boolean;
    score: number;
    current_rank: number;
}

export default class SessionManager {
    private map: KareszMap | undefined;
    protected players: Map<string, Player> = new Map<string, Player>();
    protected state: SessionState = SessionState.waiting;
    protected host: string;
    protected code: number;
    protected lastWinner: string = '';
    public destroy: () => void;
    private playerRef: { [key: number]: string } = {};

    constructor({
        code,
        name,
        socket,
        remove,
    }: {
        socket: Socket;
        code: number;
        name: string;
        remove: () => void;
    }) {
        this.code = code;
        this.host = socket.id;
        this.destroy = remove;
        this.addPlayer({ name, socket, host: true });
    }

    protected setHost(id: string) {
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
            | 'player_update'
            | 'state_update'
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
     * Get karesz objects aligned evenly on the x axis
     */
    private getKareszes({
        x,
        y,
    }: {
        x: number;
        y: number;
    }): Map<string, Karesz> {
        const map = new Map<string, Karesz>(),
            gap = Math.floor(x / (this.players.size + 1));
        let startState: State;

        Object.keys(this.players).forEach((id, index) => {
            // align players evenly
            startState = {
                position: { x: (index++ + 1) * gap, y: Math.floor(y / 2) },
                rotation: Rotation.up,
            };
            // set default props
            map.set(id, {
                score: 0,
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
            score: 0,
            current_rank: -1,
            disqualified: false,
        };

        // handle user submitting code
        socket.on('submit', ({ code }: { code: string }) => {
            if (this.state == SessionState.running) return;
            const p = this.players.get(socket.id);
            if (p === undefined) return;
            this.players.set(p.id, { ...p, code, ready: true });
            this.announce('player_update', { id: p.id, ready: true });
        });

        // unsubmit code
        socket.on('unsubmit', () => {
            if (this.state == SessionState.running) return;
            const p = this.players.get(socket.id);
            if (p === undefined) return;
            this.players.set(p.id, { ...p, code: '', ready: false });
            this.announce('player_update', { id: p.id, ready: false });
        });

        this.announce('joined', {
            id: player.id,
            name: player.name,
            ready: false,
        });

        this.players.set(player.id, player);
        if (host) this.setHost(player.id);

        // emit data about every players when joining first time
        const players: {
            [key: string]: { name: string; id: string; ready: boolean };
        } = {};

        this.players.forEach(
            (x, i) => (players[i] = { name: x.name, id: x.id, ready: x.ready })
        );

        socket.emit('fetch', {
            players,
            host: this.host,
            code: this.code,
            lastWinner: this.lastWinner,
            state: this.state,
        });
    }

    /**
     * Remove a player by it's id
     */
    public removePlayer(id: string): void {
        const player = this.players.get(id);
        this.players.delete(id);
        this.announce('left', { name: player?.name });
    }

    protected playerDeath(id: string): void {
        // do something with rank list
    }

    protected errorHandler(errors: { id: string; description: string }[]) {
        let player: Player | undefined;
        for (let i = 0; i < errors.length; i++) {
            player = this.players.get(errors[i].id);
            if (player === undefined) continue;

            this.announce('player_update', {
                id: player.id,
                disqualified: true,
            });
        }
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
        return new Promise<{
            error?: string;
            output: string;
            exitCode: number;
        }>((res) => {
            this.state = SessionState.running;
            this.announce('state_update', { state: SessionState.running });

            switch (mapType) {
                // create an empty map of size ...
                case 'empty':
                    this.fillMap({ ...(mapSize ?? { x: 10, y: 10 }) });
                // parse map made by user ...
                case 'parse':
                    if (map !== undefined) this.parseMapAsString(map);
                // load an existing map
                case 'load': // TODO: import maps from karesz
                    break;
                default:
                    res({
                        error: 'Invalid map type',
                        exitCode: 1,
                        output: 'Invalid map type',
                    });
            }

            // create new runner instance
            const game = new KareszRunner(
                'csharp',
                this.getKareszes({ ...(mapSize ?? { x: 10, y: 10 }) }),
                this.map
            );

            this.playerRef = {};
            let i = 0;
            this.players.forEach((player) => (this.playerRef[i] = player.id));
            game.run({
                players: this.playerRef,
                onError: this.errorHandler,
            }).then(({ exitCode, output, error }) => {
                res({ exitCode, output, error });
            });
        });
    }
}
