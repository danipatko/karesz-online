import { useContext } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../../components/providers/SocketProvider';

export const useSocket = (): Socket => {
    const { socket } = useContext(SocketContext);
    return socket;
};
