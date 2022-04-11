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
    idle = 0, // waiting for host to start
    waiting = 1, // waiting for players to ready
    running = 2, // running
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

interface CustomMap {
    map: { [key: string]: number }; // the matrix as a string or the map name
    type: 'load' | 'parse';
    size: number;
    mapName: string;
}

export default class Session {
    protected players: Map<string, Player> = new Map<string, Player>();
    protected state: GameState = GameState.waiting;
    protected host: string = ''; // the id of the host player
    protected code: number; // randomly generated code
    protected map: CustomMap = { map: {}, type: 'load', size: 20, mapName: '' };
    public destroy: () => void; // this is a callback function to remove this instance from the map

    // create a new instance of a game
    static create = (code: number, destroy: () => void): Session =>
        new Session(code, destroy);

    private constructor(code: number, destroy: () => void) {
        this.code = code;
        this.destroy = destroy;
    }

    // Emit an event for every player
    private announce(ev: string, params?: object): void {
        console.log(`Announce '${ev}' to ${this.players.size} player(s)`);
        for (const player of this.players.values())
            player.socket.emit(ev, { ...params });
    }

    // set the host of the game
    private setHost(socket: Socket, noemit: boolean = false): void {
        this.host = socket.id;
        // set startgame listener
        socket.on('start_game', (config: CustomMap) => {
            this.map = config;
            this.state = GameState.waiting;
        });
        // set map updater listener
        socket.on(
            'update_map',
            (config: { map: { [key: string]: number }; size: number }) => {
                this.map = {
                    ...config,
                    type: 'parse',
                    mapName: '',
                };
            }
        );
        // set map updater listener
        socket.on('load_map', ({ map }: { map: string }) => {
            // TODO: handle loading map
            this.map = {
                size: 20,
                map: {},
                type: 'parse',
                mapName: map,
            };
        });
        if (!noemit) this.announce('host_change', { host: socket.id });
    }

    // adds a new player to the game (chainable)
    public addPlayer(socket: Socket, name: string): Session {
        if (this.players.size < 1) this.setHost(socket, true);
        this.players.set(socket.id, {
            socket,
            id: socket.id,
            name: name.replace(/[^a-zA-Z\d\-\.\_]/gm, '').substring(0, 100),
            code: '',
            ready: false,
            wins: 0,
        });
        this.addListeners(socket);
        this.fetchState(socket);
        this.announce('joined', { id: socket.id, name, ready: false });
        return this;
    }

    // remove a player from the game
    public removePlayer(socket: Socket): void {
        console.log(`${socket.id} disconnected`);
        this.players.delete(socket.id);
        // end of session
        if (this.players.size < 1) {
            this.destroy();
            return;
        }
        this.announce('left', { id: socket.id });
        // choose new host
        if (socket.id === this.host)
            this.setHost(this.players.values().next().value.socket);
    }

    // gets the current state of the game for new players
    private fetchState(socket: Socket): void {
        const players: { [id: string]: {} } = {};
        for (const [k, p] of this.players.entries())
            players[k] = { name: p.name, wins: p.wins, ready: p.ready, id: k };

        socket.emit('fetch', {
            players,
            code: this.code,
            state: this.state,
            host: this.host,
            map: { map: this.map.map, size: this.map.size },
        });
    }

    // add default events to a players socket
    private addListeners(socket: Socket): void {
        // handle disconnect
        socket.on('disconnect', () => this.removePlayer(socket));
        socket.on('exit', () => this.removePlayer(socket));

        // handle user submitting code
        socket.on('submit', ({ code }: { code: string }) => {
            // don't submit while running
            if (this.state === GameState.running) {
                socket.emit('error', { error: `Please wait for game to end` });
                return;
            }
            const player = this.players.get(socket.id);
            if (player === undefined) return;
            // make player ready
            this.players.set(player.id, { ...player, code, ready: true });
            this.announce('player_update', { id: player.id, ready: true });
            // start game if everyone is ready
            if (this.state === GameState.waiting) {
                if (this.isEveryoneReady) {
                    this.state = GameState.running;
                    this.announce('state_update', { state: this.state });
                    if (this.map) this.startGame(this.map);
                }
            }
        });

        // unsubmit code
        socket.on('unsubmit', () => {
            // can't unsubmit while running
            if (this.state == GameState.running) {
                socket.emit('error', {
                    error: 'Can not unsubmit while running',
                });
                return;
            }
            const p = this.players.get(socket.id);
            if (p === undefined) return;

            this.players.set(p.id, { ...p, code: '', ready: false });
            this.announce('player_update', { id: p.id, ready: false });
        });
    }

    private get isEveryoneReady(): boolean {
        for (const player of this.players.values())
            if (!player.ready) return false;
        return true;
    }

    public get playerCount(): number {
        return this.players.size;
    }

    /**
     * Start the game
     */
    public async startGame(config: CustomMap): Promise<void> {
        //TODO: make request to rust server, set everyone unready, emit results
    }
}
