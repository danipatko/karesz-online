import {
    KareszMap,
    Field,
    FIELD_VALUES,
    Karesz,
    Rotation,
    State,
    SessionState,
    PlayerScore,
} from '../core/types';
import KareszRunner from '../core/run';
import { Socket } from 'socket.io';

interface Player {
    socket: Socket;
    id: string;
    code: string;
    ready: boolean; // *
    name: string; // *
    wins: number; // *
    // * visible for all
}

/* 
SOCKET EVENTS

public:
    joined              s -> c 
    left                s -> c
    fetch               s -> c
    host_change         s -> c
    player_update       s -> c
    state_update        s -> c
    scoreboard_update   s -> c
    submit              c -> s
    unsubmit            c -> s


host: 
    start_game c -> s
    start_fail s -> c

*/

export default class SessionManager {
    private map: KareszMap | undefined;
    protected players: Map<string, Player> = new Map<string, Player>();
    protected state: SessionState = SessionState.waiting;
    protected host: string;
    protected code: number;
    protected lastWinner: string = '';
    public destroy: () => void;

    public get playerCount(): number {
        return this.players.size;
    }

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
        this.addPlayer({ name, socket });
    }

    /**
     * Set host of game
     */
    protected setHost(id: string) {
        const host = this.players.get(id);
        if (host === undefined) return;

        this.host = id;
        host.socket.on('disconnect', () => {
            this.players.delete(host.id);
            // delete session
            if (this.players.size === 0) this.destroy();
            this.announce('left', { id: host.id });
            // find new host
            this.setHost(Object.keys(this.players)[0]);
        });

        // start game event
        host.socket.on('start_game', () => {
            this.startGame({ mapType: 'empty', mapSize: { x: 10, y: 10 } });
        });

        this.announce('host_change', { host: id });
    }

    /**
     * Emit an event for every player
     */
    private announce(
        ev:
            | 'left' // player left
            | 'joined' // player joined
            | 'player_update' // player ready
            | 'state_update' // game start / end
            | 'host_change' // new host
            | 'scoreboard_update', // on game end
        params?: object
    ): void {
        for (const player of this.players.values())
            player.socket.emit(ev, { ...params });
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
                position: { x: ++index * gap, y: Math.floor(y / 2) },
                rotation: Rotation.up,
            };
            // set default props
            map.set(id, {
                id,
                kills: 0,
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
            wins: 0,
        };

        // handle user submitting code
        socket.on('submit', ({ code }: { code: string }) => {
            if (this.state == SessionState.running) return;
            const p = this.players.get(player.id);
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

        // join event for others
        this.announce('joined', {
            id: player.id,
            name: player.name,
            ready: false,
            wins: 0,
        });

        this.players.set(player.id, player);
        if (this.players.size == 1) this.setHost(player.id);

        // create a list of joined people
        const players: {
            [id: string]: {
                name: string;
                wins: number;
                ready: boolean;
                id: string;
            };
        } = {};
        for (const [k, p] of this.players.entries())
            players[k] = { name: p.name, wins: p.wins, ready: p.ready, id: k };

        socket.emit('fetch', {
            players,
            host: this.host,
            code: this.code,
        });
    }

    /**
     * Announce round results
     */
    protected gameEnd({
        exitCode,
        output,
        results,
        error,
    }: {
        results: Map<string, PlayerScore>;
        output: string;
        error?: string;
        exitCode: number;
    }): void {
        this.announce('scoreboard_update', {
            results,
            error,
            exitCode,
            output,
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
    }): Promise<void> {
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
                break;
        }

        // create new runner instance
        const game = new KareszRunner(
            'csharp',
            this.getKareszes({ ...(mapSize ?? { x: 10, y: 10 }) }),
            this.map
        );

        const players: { [key: string]: string } = {};
        for (const v of this.players.values()) players[v.id] = v.code;

        console.log(players);
        // this.gameEnd(
        const res = await game.run({ players });
        this.gameEnd(res);

        console.log('HEHEHEHA');
        // );
    }
}
