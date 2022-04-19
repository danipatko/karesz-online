import { Socket } from 'socket.io';
import host from '../host';
import { GameMap } from '../shared/types';
import { GameState } from '../shared/types';

interface Player {
    id: string;
    code: string;
    name: string; // *
    wins: number; // *
    ready: boolean; // *
    socket: Socket;
    // * visible for all
}

interface StartState {
    start_x: number;
    start_y: number;
    start_rotation: number;
}

interface PlayerStartState extends StartState {
    code: string;
    name: string;
}

type MultiPlayerResponse = {
    error?: string;
    draw: boolean;
    winner: string;
    rounds: number;
    scoreboard: {
        [name: string]: {
            [key: string]: number | string | number[] | {};
            kills: number;
            place: number;
            death: string;
            steps: number[];
            survived: number;
        };
    };
};

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

export default class Session {
    protected players: Map<string, Player> = new Map<string, Player>();
    protected state: GameState = GameState.idle;
    protected host: string = ''; // the id of the host player
    protected code: number; // randomly generated code
    protected map: GameMap = {
        objects: {},
        type: 'load',
        size: 20,
        load: '',
    };
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
        // set map updater listener
        socket.on(
            'update_map',
            (config: {
                size: number;
                type: 'parse' | 'load';
                load?: string;
                objects?: { [key: string]: number };
            }) => {
                if (config.type === 'parse' && config.objects)
                    this.map = {
                        load: '',
                        type: 'parse',
                        size: config.size,
                        objects: config.objects,
                    };
                else if (config.load)
                    this.map = {
                        load: config.load,
                        size: config.size,
                        type: 'load',
                        objects: {},
                    };
                else {
                    socket.emit('error', { error: 'Bad request' });
                    return;
                }
                this.announce('map_update', { map: this.map });
            }
        );
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
        this.announce('left', { id: socket.id });
        this.players.delete(socket.id);
        // end of session
        if (this.players.size < 1) {
            this.destroy();
            return;
        }
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
            map: this.map,
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
            // check if all players are ready
            const waiting = this.players.size - this.readyCount;
            if (waiting !== 0)
                this.announce('error', {
                    error: `${
                        player.name
                    } is ready. Waiting for ${waiting} player${
                        waiting == 1 ? '' : 's'
                    }.`,
                });
            else if (this.map) this.startGame();
        });

        // unsubmit code
        socket.on('unsubmit', () => {
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

    private get readyCount(): number {
        let res = 0;
        for (const player of this.players.values()) if (player.ready) res++;
        return res;
    }

    public get playerCount(): number {
        return this.players.size;
    }

    private randCoord(): [number, number] {
        return [
            Math.floor(Math.random() * this.map.size),
            Math.floor(Math.random() * this.map.size),
        ];
    }

    // get player positions
    private getPlayerStartingPostions(): { [key: string]: PlayerStartState } {
        const res: { [key: string]: PlayerStartState } = {};

        const isOccupied = (x: number, y: number): boolean => {
            for (const { start_x, start_y } of Object.values(res)) {
                if (start_x === x && start_y === y) return true;
            }
            return this.map.objects[`${x}-${y}`] !== undefined;
        };

        this.players.forEach((player) => {
            let point = this.randCoord();
            while (isOccupied(point[0], point[1])) point = this.randCoord();

            res[player.id] = {
                code: player.code.replaceAll(/\n/g, '%0A'),
                name: player.id, // id is assigned as name
                start_x: point[0],
                start_y: point[1],
                start_rotation: Math.floor(Math.random() * 4),
            };
        });

        return res;
    }

    private getMap(): string {
        let result = '';
        for (let y = 0; y < this.map.size; y++) {
            for (let x = 0; x < this.map.size; x++)
                result += this.map.objects[`${x}-${y}`] ?? '0';
            result += '%0A'; // use url encoded newline
        }
        return result.substring(0, result.length - 3); // remove last newline
    }

    /**
     * Start the game
     */
    public async startGame(): Promise<void> {
        this.state = GameState.running;
        this.announce('state_update', { state: this.state });

        const startState = this.getPlayerStartingPostions();

        // TODO: make this a configurable option
        const response = await fetch(`${host}/mp/custom`, {
            method: 'POST',
            body: JSON.stringify({
                map: this.getMap(),
                size_x: this.map.size,
                size_y: this.map.size,
                players: Object.values(startState),
            }),
        });

        this.state = GameState.idle;
        this.announce('state_update', { state: this.state });

        this.players.forEach((x) => {
            x.ready = false;
        });
        this.announce('unready');

        if (!response.ok) {
            this.announce('error', {
                error: `Failed to start game ([${response.status}] ${response.statusText})`,
            });
            return;
        }

        const result = await response.json();

        // runtime or compile error -> show logs to players to find the error
        if (result.error) {
            console.log(result.error);
            this.announce('compile_error', { error: result.error });
            return;
        }

        // update scoreboard with start state
        for (const id in result.scoreboard) {
            result.scoreboard[id] = {
                ...result.scoreboard[id],
                name: this.players.get(id)?.name ?? '',
                start: {
                    x: startState[id].start_x,
                    y: startState[id].start_y,
                    rotation: startState[id].start_rotation,
                },
            };
        }

        this.announce('game_end', {
            draw: result.draw,
            rounds: result.rounds,
            winner: result.winner,
            players: result.scoreboard,
        });
    }
}
