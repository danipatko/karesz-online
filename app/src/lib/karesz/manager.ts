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

enum GameState {
    waiting = 0,
    running = 1,
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
    protected players: Map<string, Player> = new Map<string, Player>();
    protected state: GameState = GameState.waiting;
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
        host.socket.on(
            'start_game',
            ({ mapType }: { mapType: 'empty' | 'parse' | 'load' }) => {
                this.startGame({ mapType: 'empty', mapSize: { x: 10, y: 10 } });
            }
        );

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
            if (this.state == GameState.running) return;
            const p = this.players.get(player.id);
            if (p === undefined) return;
            this.players.set(p.id, { ...p, code, ready: true });
            this.announce('player_update', { id: p.id, ready: true });
        });

        // unsubmit code
        socket.on('unsubmit', () => {
            if (this.state == GameState.running) return;
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
        mapSize: { x: number; y: number };
    }): Promise<void> {
        this.state = GameState.running;
        this.announce('state_update', { state: GameState.running });

        // TODO: load maps
        const players = Array.from(this.players.values()).map((x) => {
            return { name: x.id, code: x.code };
        });
        const result = await fetch(`127.0.0.1:8000/mp/custom`, {
            method: 'POST',
            body: JSON.stringify({
                players,
                map: map ?? '',
                size_x: mapSize.x,
                size_y: mapSize.y,
            }),
        });
        console.log(await result.json());
    }
}
