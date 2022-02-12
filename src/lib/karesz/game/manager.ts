import {
    KareszMap,
    Field,
    FIELD_VALUES,
    Karesz,
    Rotation,
    State,
} from '../core/types';
import KareszRunner from '../core/run';
import type { Socket } from 'socket.io';

interface Player {
    socket: Socket;
    ready: boolean;
    id: string;
    name: string;
    code: string;
}

enum SessionState {
    waiting_for_host = 0,
    compiling = 1,
    running = 2,
    results = 3,
}

export default class SessionManager {
    private map: KareszMap;
    protected players: Map<number, Player> = new Map<number, Player>();
    protected state: SessionState = SessionState.waiting_for_host;
    protected code: number = Math.random() * 8999 + 1000; // TODO: random int

    /**
     * Emit an event for every player
     */
    private announce(
        ev: 'left' | 'joined' | 'update_player' | 'update_env' | 'results',
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
        const map = new Map<number, Karesz>();
        const gap = Math.floor(x / (this.players.size + 1));
        this.players.forEach((player, key) => {
            const startState: State = {
                position: { x: (key + 1) * gap, y: Math.floor(y / 2) },
                rotation: Rotation.up,
            };
            map.set(key, {
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
    public addPlayer({ name, socket }: { name: string; socket: Socket }): void {
        const player: Player = {
            name,
            socket,
            id: socket.id,
            ready: false,
            code: '',
        };
        this.players.set(this.players.size, player);
        this.announce('joined', { name: player.name, ready: false });
    }

    /**
     * Remove a player by it's index
     */
    public removePlayer(index: number): void {
        this.players.delete(index);
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
        mapSize: { x: number; y: number };
    }): Promise<{ error?: string; output: string; exitCode: number }> {
        switch (mapType) {
            // create an empty map of size ...
            case 'empty':
                this.fillMap({ ...mapSize });
            // parse map made by user ...
            case 'parse':
                this.parseMapAsString(map);
            // load an existing map
            case 'load':
                break;
        }
        // create new runner instance
        const game = new KareszRunner(
            'CSHARP',
            this.getKareszes({ ...mapSize }),
            this.map
        );

        return await game.run({ code: '' });
    }
}
