import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { setTimeout } from 'timers/promises';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = io();
        console.log(`socket connected ${s.id}`);
        setSocket(s);
    }, [setSocket]);

    return socket;
};
