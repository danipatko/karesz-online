import { SessionState } from '../karesz/core/types';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Game {
    connected: boolean;
    players: { [key: string]: { name: string; id: string; ready: boolean } };
    code: number;
    host: string;
    lastWinner: string;
    state: SessionState;
}
export const useGame = (): [
    Game,
    {
        join: (data: { name: string; code: number }) => void;
        fetchState: () => void;
    }
] => {
    const [socket, setSocket] = useState<Socket>(null as any);

    useEffect(() => {
        const socket = io();
        // called after joining
        socket.on(
            'fetch',
            (data: {
                host: string;
                players: {
                    [key: string]: { name: string; id: string; ready: boolean };
                };
                code: number;
                lastWinner: string;
                state: SessionState;
            }) => {
                console.log(data);

                setState({
                    ...data,
                    connected: true,
                });
                // */
            }
        );
        // called on phase update
        socket.on('state_update', ({ state: _state }: { state: number }) =>
            setState({ ...state, state: _state })
        );
        // called when a player joins
        socket.on(
            'joined',
            (p: { name: string; id: string; ready: boolean }) => {
                console.log(`--------- Player join ---------`);
                console.log(state);
                state.players = { ...state.players, [p.id]: p };
                setState({ ...state });
            }
        );
        // called when a player leaves
        socket.on('left', ({ id }: { id: string }) => {
            delete state.players[id];
            setState({ ...state });
        });
        // called when a player signals ready (or unready)
        socket.on(
            'player_update',
            ({ id, ready }: { id: string; ready: boolean }) => {
                state.players[id] = { ...state.players[id], ready };
            }
        );

        setSocket(socket);
    }, [setSocket]);

    const [state, setState] = useState<Game>({
        connected: false,
        state: SessionState.waiting,
        code: 0,
        host: '',
        lastWinner: '',
        players: {},
    });

    const join = (data: { name: string; code: number }) => {
        if (socket !== null) socket.emit('join', data);
    };

    const fetchState = () => {
        console.log(state);
    };

    return [state, { join, fetchState }];
};
