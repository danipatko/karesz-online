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
    notfound = 1, // if game is not found
    prejoin = 2, // code is correct, promt name
    joined = 3, // idle
    running = 4, // game is running
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
