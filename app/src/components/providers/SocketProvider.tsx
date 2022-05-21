import React from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io();

export const SocketContext = React.createContext<{ socket: Socket }>({
    socket,
});

export const SocketProvider: React.FC = ({ children }) => (
    <SocketContext.Provider value={{ socket }}>
        {children}
    </SocketContext.Provider>
);
