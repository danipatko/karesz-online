import { Socket } from 'socket.io';

export interface Player {
    id: string;
    name: string;
    code: string;
}

export interface PlayerStart extends Player {
    x: number;
    y: number;
    rotation: number;
}

export interface GamePlayer extends Player {
    wins: number;
    ready: boolean;
    socket: Socket;
}

export interface PlayerStartState extends PlayerStart {
    endln: number;
    startln: number;
}

export interface TemplateSettings {
    TIMEOUT: number;
    MAP_WIDTH: number;
    MAP_HEIGHT: number;
    MIN_PLAYERS: number;
    MAP_OBJECTS: { [key: string]: number };
    MAX_ITERATIONS: number;
}

export const random = (): string => {
    return `_${Math.random().toString(16).substring(2, 10)}`;
};

export interface CommandResult {
    exitCode: number;
    stdout: string;
    stderr: string;
    result: object; // the last line parsed from stdout
}
