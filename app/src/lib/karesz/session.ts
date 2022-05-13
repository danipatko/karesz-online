import { Socket } from 'socket.io';
import { Runner } from './run/runner';
import IPlayer from './player/player';
import { CommandResult, PlayerStart } from './types';
import { MapCreator } from './map/map';
import { Template } from './run/template';
import { GamePhase, MultiResult } from '../shared/types';

export default class Session {
    protected map: MapCreator;
    protected code: number;
    protected host: string = ''; // the id of the host player
    protected phase: GamePhase = GamePhase.idle;
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
            // clear map
            () => this.announce('map_update_clear'),
            // object change
            (position: [number, number], field: number) =>
                this.announce('map_update_object', { position, field })
        );
        // set join code and destroy callback
        this.code = code;
        this.destroy = destroy;
    }

    // emit an event for every player
    private announce(ev: string, params?: object): void {
        console.log(`Announce '${ev}' to ${this.players.size} player(s)`); // DEBUG
        for (const { socket } of this.players.values())
            socket.emit(ev, { ...params });
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
                field,
                position,
            }: {
                field: number;
                position: [number, number];
            }) => this.map.addObject(position, field)
        );
    }

    // set the host of the game
    private setHost(socket: Socket): void {
        this.host = socket.id;
        this.setMapEvents(socket);
        this.announce('game_host_change', { host: socket.id });
    }

    // set and announce the phase
    private setPhase(phase: GamePhase): void {
        this.phase = phase;
        this.announce('game_phase_change', { phase });
    }

    // check if everyone is ready
    private checkCanStart(): void {
        let readyPeople = 0;
        for (const { isReady } of this.players.values())
            if (isReady) readyPeople++;

        this.announce('game_info_waiting', {
            waiting: this.players.size - readyPeople,
        });

        // no one is ready -> idle
        if (readyPeople === 0) this.setPhase(GamePhase.idle);
        // everyone is ready -> start the game
        else if (readyPeople === this.players.size) this.startGame();
        // some is ready -> waiting
        else this.setPhase(GamePhase.waiting);
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
                this.phase,
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

    // get a random coordniate on the map
    private randCoord(): [number, number] {
        return [
            Math.floor(Math.random() * this.map.width),
            Math.floor(Math.random() * this.map.height),
        ];
    }

    // get randomized player positions
    private getPlayerStartingPostions(): PlayerStart[] {
        const result: PlayerStart[] = [];

        // checks if a position is already taken
        const isOccupied = (_x: number, _y: number): boolean => {
            for (const { x, y } of Object.values(result))
                if (x === _x && y === _y) return true;
            return this.map.objects.has(`${_x}_${_y}`);
        };

        this.players.forEach((player) => {
            let point = this.randCoord();
            while (isOccupied(point[0], point[1])) point = this.randCoord();

            result.push({
                x: point[0],
                y: point[1],
                id: player.id,
                name: player.name,
                code: player.code,
                rotation: Math.floor(Math.random() * 4),
            });
        });

        return result;
    }

    // start the game
    public async startGame(): Promise<void> {
        this.setPhase(GamePhase.running);
        const startState = this.getPlayerStartingPostions();

        // unready all
        this.players.forEach((x) => {
            x.isReady = false;
        });

        const template = Template.create()
            .setMap({ x: this.map.width, y: this.map.height })
            .addObjects(this.map.objects)
            .multiPlayer()
            .addPlayers(startState, (id, severity, reason) => {
                // emit an event about a player receiving a warning or an error
                severity === 'error'
                    ? this.players.get(id)?.err(reason)
                    : this.players.get(id)?.warn(reason);
            })
            .generate();

        const result = (await Runner.run(
            template.code,
            'multi'
        )) as CommandResult<null | MultiResult>;

        if (!result || result.exitCode !== 0) {
            // try to find player who caused the error
            // const trace = result.stderr
            //     .split('\n')
            //     .filter((x) => x.match(/^\s*at\s/))[0];

            this.announce('game_error', {
                stderr: result.stderr,
                stdout: result.stdout,
            });

            return;
        }

        console.log(result);

        // this.announce('game_end', {
        //     draw: result.draw,
        //     rounds: result.rounds,
        //     winner: result.winner,
        //     players: result.scoreboard,
        // });

        this.announce('game_end', {
            draw: false,
        });
    }

    public get playerCount(): number {
        return this.players.size;
    }
}
