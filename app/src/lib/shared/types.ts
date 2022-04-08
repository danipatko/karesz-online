// here are the types of the frontend

export enum View {
    Home,
    Edit,
    Playground,
    Multiplayer,
    Docs,
}

export enum GameState {
    disconnected = 0, // not initted
    prejoin = 1, // code is correct, promt name
    joined = 2, // idle
    wating = 3, // host started the game, but not everyone is ready
    running = 3, // everyone is ready, start game
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
