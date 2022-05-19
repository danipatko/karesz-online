import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (): [
    Socket | null,
    (events: { [event: string]: (...args: any[]) => void }) => void
] => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = io();
        setSocket(s);
    }, []);

    // bind listeners only once
    const bind = (events: { [event: string]: (...args: any[]) => void }) => {
        console.log('Called');
        setSocket((s) => {
            if (!s) return null;
            for (const [event, callback] of Object.entries(events)) {
                s.off(event); // make sure an event has only one listener
                s.on(event, callback);
            }
            return s;
        });
    };

    return [socket, bind];
};
