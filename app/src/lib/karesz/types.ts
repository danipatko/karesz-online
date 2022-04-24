import { Socket } from 'socket.io';

export interface Player {
    id: string;
    name: string;
    code: string;
}

export interface GamePlayer extends Player {
    wins: number;
    ready: boolean;
    socket: Socket;
}

export interface PlayerCode extends Player {
    startln: number;
    endln: number;
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
