import { Socket } from 'socket.io';
import { GameMap, GamePhase, IGameMap, Spieler } from '../../shared/types';

// on server side
export interface Player extends Spieler {
    socket: Socket;
    code: string;
}

export default class IPlayer implements Player {
    public id: string;
    public name: string;
    public wins: number = 0;
    public code: string = '';
    public error: boolean = false;
    public socket: Socket;
    public warning: boolean = false;
    public isReady: boolean = false;
    private onExit: (id: string) => void;
    private onReady: () => void;
    private announce: ((event: string, data: any) => void) | null = null;

    private setEvents() {
        // when a player submits their code
        this.socket.on('player_ready', ({ code }: { code?: string }) => {
            this.isReady = !this.isReady;
            this.code = this.isReady && code ? code : '';
            this.warning = false;
            this.error = false;

            this.announce &&
                this.announce('player_ready', {
                    id: this.id,
                    isReady: true,
                });

            this.onReady();
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
        map: IGameMap,
        code: number,
        host: string,
        phase: GamePhase,
        players: Map<string, IPlayer>
    ): IPlayer {
        const playerArray: Spieler[] = [];
        for (const player of players.values()) playerArray.push(player.json());

        this.socket.emit('fetch', {
            map,
            code,
            host,
            phase,
            players: playerArray,
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
