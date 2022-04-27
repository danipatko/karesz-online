import { Socket } from 'socket.io';
import { GameMap, GamePhase } from '../../shared/types';

// on client side
export interface Spieler {
    id: string;
    wins: number;
    name: string;
    error: boolean;
    warning: boolean;
    isReady: boolean;
}

// on server side
export interface Player extends Spieler {
    socket: Socket;
    code: string;
}

export default class IPlayer implements Player {
    public socket: Socket;
    public id: string;
    public name: string;
    public wins: number = 0;
    public code: string = '';
    public error: boolean = false;
    public warning: boolean = false;
    public isReady: boolean = false;
    private announce: ((event: string, data: any) => void) | null = null;
    private onReady: () => void;
    private onExit: (id: string) => void;

    private setEvents() {
        // when a player submits their code
        this.socket.on('player_ready', ({ code }: { code: string }) => {
            this.isReady = true;
            this.code = code;
            this.warning = false;
            this.error = false;

            this.announce && // TODO: automatically clear warnings and errors client-side
                this.announce('player_ready', { id: this.id, ready: true });
            this.onReady();
        });

        // when a player unsubmits their code
        this.socket.on('player_unready', () => {
            this.isReady = false;
            this.announce &&
                this.announce('player_unready', { id: this.id, ready: false });
        });

        // when a player sends something to chat
        this.socket.on('chat', ({ message }: { message: string }) => {
            this.announce &&
                this.announce('chat', { sender: this.id, message });
        });

        // when a player exits the game
        this.socket.on('exit', () => this.onExit(this.socket.id));
        this.socket.on('disconnect', () => this.onExit(this.socket.id));
    }

    public static create(name: string, socket: Socket): IPlayer {
        return new IPlayer(
            name,
            socket,
            () => {},
            () => {}
        );
    }

    private constructor(
        name: string,
        socket: Socket,
        onReady: () => void,
        onExit: (id: string) => void
    ) {
        this.id = socket.id; // same as key
        this.name = name.replace(/[^a-zA-Z\d\-\.\_]/gm, '').substring(0, 100);
        this.socket = socket;
        this.onExit = onExit;
        this.onReady = onReady;
        this.setEvents();
    }

    // set the announce function callback
    public onEvent(handler: (event: string, data: any) => void): IPlayer {
        this.announce = handler;
        return this;
    }

    // return data received by the client
    public json(): Spieler {
        return {
            id: this.id,
            name: this.name,
            wins: this.wins,
            error: this.error,
            warning: this.warning,
            isReady: this.isReady,
        };
    }

    // emit info about the game when joining for the first time
    public fetch(
        map: GameMap,
        code: number,
        host: string,
        phase: GamePhase,
        players: Map<string, IPlayer>
    ): IPlayer {
        this.socket.emit('fetch', {
            map,
            code,
            host,
            phase,
            players: Object.values(players.values()).map((player) =>
                player.json()
            ),
        });
        return this;
    }

    // show a warning to the player and display an icon to the others
    public warn(message: string): void {
        this.socket.emit('warn', message);
        this.announce && this.announce('player_warn', { id: this.id });
    }

    // show an error to the player and display an icon to the others
    public err(message: string): void {
        this.socket.emit('error', message);
        this.announce && this.announce('player_error', { id: this.id });
    }

    public ready(handler: () => void): IPlayer {
        this.onReady = handler;
        return this;
    }

    public leave(handler: (id: string) => void): IPlayer {
        this.onExit = handler;
        return this;
    }
}
