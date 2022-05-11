import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type SocketState = {
    socket: Socket | null;
    bind: (event: string, callback: (...args: any[]) => void) => void;
    bindAll: (
        events: { event: string; callback: (...args: any[]) => void }[]
    ) => void;
};

export const useSocket = (): SocketState => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = io();
        setSocket(s);
    }, [setSocket]);

    // bind a listener to the socket
    const bind = (event: string, callback: (...args: any[]) => void) =>
        socket?.on(event, callback);

    // bind a series of events to the socket
    const bindAll = (
        events: { event: string; callback: (...args: any[]) => void }[]
    ) => {
        for (const { event, callback } of events) bind(event, callback);
    };

    return { socket, bind, bindAll };
};
