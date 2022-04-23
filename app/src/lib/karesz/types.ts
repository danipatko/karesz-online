import { Socket } from 'socket.io';

export interface Player {
    id: string;
    code: string;
    name: string; // *
    wins: number; // *
    ready: boolean; // *
    socket: Socket;
    // * visible for all
}
