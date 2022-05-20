import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (): [
    Socket,
    (events: { [event: string]: (...args: any[]) => void }) => void,
    () => string
] => {
    const [socket, setSocket] = useState<Socket>(null as any);

    useEffect(() => {
        const s = io();
        setSocket(s);
    }, []);

    const getId = (): string => socket?.id || '';

    // bind listeners only once
    const bind = (events: { [event: string]: (...args: any[]) => void }) => {
        console.log('Called');
        setSocket((s) => {
            for (const [event, callback] of Object.entries(events)) {
                s.off(event); // make sure an event has only one listener
                s.on(event, callback);
            }
            return s;
        });
    };

    return [socket, bind, getId];
};
