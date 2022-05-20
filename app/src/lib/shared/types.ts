// here are the types of the frontend

export enum View {
    Home,
    Edit,
    Playground,
    Multiplayer,
    Docs,
}

export enum GamePhase {
    disconnected = 0, // not connected
    prejoin = 1, // code is correct, promt name
    idle = 2, // idle
    waiting = 3, // waiting for players
    running = 4, // everyone is ready, start game
}

export interface Player {
    name: string;
    steps: number[];
    start: {
        x: number;
        y: number;
        rotation: number;
    };
}

export interface IPlayer {
    name: string; // display name
    id: string; // socket id
    ready: boolean; // submitted code and ready
    wins: number; // win count
}

export interface GameMap {
    type: 'load' | 'parse';
    width: number;
    height: number;
    mapName: string;
    objects: Map<string, number>;
}

export interface IGameMap {
    type: 'load' | 'parse';
    width: number;
    height: number;
    mapName: string;
    objects: [string, number][];
}

// "{{ \\"ended\\":\\"{Reason}\\", \\"steps\\":[{string.Join(',', Steps${rand})}], \\"rocks\\": {{ \\"placed\\":{RocksPlaced${rand}}, \\"picked_up\\":{RocksPickedUp${rand}} }}, \\"start\\": {{ \\"x\\":0, \\"y\\":0, \\"rotation\\":0 }} }}");
export interface SingleResult {
    ended: string;
    steps: number[];
    rocks: {
        placed: number;
        picked_up: number;
    };
    start: {
        x: number;
        y: number;
        rotation: number;
    };
}

export interface PlayerResult {
    name: string;
    death: string;
    alive: number;
    steps: number[];
    rocks: { placed: number; picked_up: number };
    started: { x: number; y: number; rotation: number };
    survived: boolean;
    placement: number;
}

// game -> "{{ \\"rounds\\":{ROUND${rand}}, \\"players\\": {{ {string.Join(',', ScoreBoard${rand}.Values.Select(x => x.ToJson()).ToArray())} }} }}");
// player -> "\"{ID}\": {{ \"placement\":{Placement}, \"name\":\"{Name}\", \"started\": {{ \"x\":{StartState.x}, \"y\":{StartState.y}, \"rotation\":{StartState.rotation} }}, \"survived\":{(Survived ? "true" : "false")}, \"death\":\"{Death}\",  \"alive\":{RoundsAlive}, \"rocks\":{{ \"placed\":{RocksPlaced}, \"picked_up\":{RocksPickedUp} }}, \"steps\":[{string.Join(',', Steps)}] }}"
export interface MultiResult {
    rounds: number;
    players: {
        [key: string]: PlayerResult; // key is the ID of the player
    };
}

// base player object
export interface Spieler {
    id: string;
    wins: number;
    name: string;
    error: boolean;
    warning: boolean;
    isReady: boolean;
}
