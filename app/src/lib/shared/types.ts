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
    objects: Map<[number, number], number>;
}
