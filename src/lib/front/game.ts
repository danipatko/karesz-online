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
        submit: (s: string) => void;
    }
] => {
    const [socket, setSocket] = useState<Socket>(null as any);
    const [state, setState] = useState<Game>({
        connected: false,
        state: SessionState.waiting,
        code: -1,
        host: '',
        lastWinner: '',
        players: {},
    });

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
                setState((s) => {
                    return { ...data, connected: true };
                });
                // */
            }
        );
        // called on phase update
        socket.on('state_update', ({ state: _state }: { state: number }) =>
            setState((s) => {
                return { ...s, state: _state };
            })
        );
        // called when a player joins
        socket.on(
            'joined',
            (p: { name: string; id: string; ready: boolean }) => {
                setState((s) => {
                    console.log(s);
                    s.players[p.id] = p;
                    return { ...s };
                });
            }
        );
        // called when a player leaves
        socket.on('left', ({ id }: { id: string }) => {
            setState((s) => {
                delete s.players[id];
                return { ...s };
            });
        });
        // called when a player signals ready (or unready)
        socket.on(
            'player_update',
            ({ id, ready }: { id: string; ready: boolean }) => {
                setState((s) => {
                    s.players[id].ready = ready;
                    return { ...s };
                });
            }
        );

        setSocket(socket);
    }, [setSocket]);

    const join = (data: { name: string; code: number }) => {
        if (socket !== null) socket.emit('join', data);
    };

    const fetchState = () => {
        console.log(state);
    };

    const submit = (code: string) => {
        if (socket !== null) socket.emit('submit', { code });
    };

    return [state, { join, fetchState, submit }];
};
