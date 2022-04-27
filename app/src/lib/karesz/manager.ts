import { Socket } from 'socket.io';
import { Runner } from './run/runner';
import { GameMap } from '../shared/types';
import { Template } from './run/template';
import { GamePhase } from '../shared/types';
import { GamePlayer, PlayerStart } from './types';
import { MapCreator } from './map/map';
import IPlayer from './player/player';

export default class Session {
    protected map: MapCreator;
    protected code: number;
    protected host: string = ''; // the id of the host player
    protected state: GamePhase = GamePhase.idle;
    protected players: Map<string, IPlayer> = new Map<string, IPlayer>();

    // this is a callback function to remove this instance from the map
    public destroy: () => void;

    // create a new instance of a game
    static create = (code: number, destroy: () => void): Session =>
        new Session(code, destroy);

    private constructor(code: number, destroy: () => void) {
        // create mapCreator object
        this.map = MapCreator.create().onChange(
            // type change
            (type: 'load' | 'parse') =>
                this.announce('map_update_type', { type }),
            // loaded map change
            (mapName: string) => this.announce('map_update_load', { mapName }),
            // size change
            (width: number, height: number) =>
                this.announce('map_update_size', { width, height }),
            // object change
            (position: [number, number], field: number) =>
                this.announce('map_update_object', { position, field })
        );
        // set join code and destroy callback
        this.code = code;
        this.destroy = destroy;
    }

    // Emit an event for every player
    private announce(ev: string, params?: object): void {
        console.log(`Announce '${ev}' to ${this.players.size} player(s)`);
        for (const player of this.players.values())
            player.socket.emit(ev, { ...params });
    }

    // bind map events to the host's socket
    private setMapEvents(socket: Socket): void {
        // type change
        socket.on('map_update_type', (type: 'load' | 'parse') =>
            this.map.setType(type)
        );
        // loaded map change
        socket.on('map_update_load', (mapName: string) =>
            this.map.loadMap(mapName)
        );
        // size change
        socket.on('map_update_size', (width: number, height: number) =>
            this.map.setSize(width, height)
        );
        // object update
        socket.on(
            'map_update_object',
            ({
                position,
                field,
            }: {
                position: [number, number];
                field: number;
            }) => this.map.addObject(position, field)
        );
    }

    // set the host of the game
    private setHost(socket: Socket): void {
        this.host = socket.id;
        this.setMapEvents(socket);
        this.announce('game_host_change', { host: socket.id });
    }

    // check if everyone is ready
    private checkCanStart(): void {
        let readyPeople = 0;
        for (const { isReady } of this.players.values())
            if (isReady) readyPeople++;

        this.announce('game_info_waiting', {
            waiting: this.players.size - readyPeople,
        });

        // everyone is ready -> start the game
        readyPeople === this.players.size && this.startGame();
    }

    // adds a new player to the game
    public addPlayer(socket: Socket, name: string): Session {
        // the first player added to the game is the host
        if (this.players.size < 1) this.setHost(socket);

        const player = IPlayer.create(name, socket)
            // bind events
            .ready(this.checkCanStart)
            .leave(this.removePlayer)
            .onEvent(this.announce)
            // send player data about the game
            .fetch(
                this.map.fetch(),
                this.code,
                this.host,
                this.state,
                this.players
            );

        this.players.set(socket.id, player);
        this.announce('player_join', player.json());

        return this;
    }

    // remove a player from the game
    public removePlayer(id: string): void {
        console.log(`${id} disconnected`); // DEBUG
        this.announce('player_leave', { id });
        this.players.delete(id);
        // no players left
        if (this.players.size < 1) return void this.destroy();

        // choose new host
        if (id === this.host)
            this.setHost(this.players.values().next().value.socket);
    }

    public get playerCount(): number {
        return this.players.size;
    }

    private randCoord(): [number, number] {
        return [
            Math.floor(Math.random() * this.map.width),
            Math.floor(Math.random() * this.map.height),
        ];
    }

    // get player positions
    private getPlayerStartingPostions(): PlayerStart[] {
        const res: PlayerStart[] = [];

        const isOccupied = (_x: number, _y: number): boolean => {
            for (const { x, y } of Object.values(res))
                if (x === _x && y === _y) return true;
            return this.map.objects.has([_x, _y]);
        };

        this.players.forEach((player) => {
            let point = this.randCoord();
            while (isOccupied(point[0], point[1])) point = this.randCoord();

            res.push({
                x: point[0],
                y: point[1],
                id: player.id,
                name: player.name,
                code: player.code,
                rotation: Math.floor(Math.random() * 4),
            });
        });

        return res;
    }

    /**
     * Start the game
     */
    public async startGame(): Promise<void> {
        this.state = GamePhase.running;
        this.announce('state_update', { state: this.state });

        const startState = this.getPlayerStartingPostions();

        this.state = GamePhase.idle;
        this.announce('state_update', { state: this.state });

        this.players.forEach((x) => {
            x.isReady = false;
        });

        const template = Template.create()
            .setMap({ x: this.map.width, y: this.map.height })
            .addObjects({}) // TODO: append objects
            .multiPlayer()
            .addPlayers(startState, (id, severity, reason) => {
                // emit an event about a player receiving a warning or an error
                this.announce(severity, { id, error: reason });
            })
            .generate();

        // single
        // const template2 = Template.create()
        //     .singlePlayer()
        //     .generate(
        //         { code: '', id: '', name: '', rotation: 0, x: 0, y: 0 },
        //         () => {
        //             console.log('bruh');
        //         }
        //     );

        const res = await Runner.run(template.code, template.rand);

        console.log(res);

        // this.announce('game_end', {
        //     draw: result.draw,
        //     rounds: result.rounds,
        //     winner: result.winner,
        //     players: result.scoreboard,
        // });
    }
}
