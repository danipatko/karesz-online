import { PlayerScore, SessionState } from '../karesz/core/types';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Player {
    name: string;
    id: string;
    ready: boolean;
    wins: number;
}

export interface Game {
    connected: boolean;
    players: { [id: string]: Player };
    code: number;
    host: string;
    state: SessionState;
    round: {
        exitCode: number;
        errors: string;
        output: string;
    };
    scoreBoard: { [id: string]: PlayerScore };
}

export const useGame = (): [
    Game,
    {
        join: (name: string, code: number) => void;
        create: (name: string) => void;
        startGame: () => void;
        submit: (s: string) => void;
    }
] => {
    const [socket, setSocket] = useState<Socket>(null as any);
    const [state, setState] = useState<Game>({
        connected: false,
        state: SessionState.waiting,
        code: -1,
        host: '',
        players: {},
        scoreBoard: {},
        round: {
            errors: '',
            exitCode: -1,
            output: '',
        },
    });

    useEffect(() => {
        const socket = io();
        // called after joining
        socket.on(
            'fetch',
            (data: {
                host: string;
                players: { [id: string]: Player };
                code: number;
                state: SessionState;
            }) => {
                setState(() => {
                    return {
                        ...data,
                        connected: true,
                        scoreBoard: {},
                        round: { errors: '', exitCode: -1, output: '' },
                    };
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
            (p: { name: string; id: string; ready: boolean; wins: number }) => {
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
        // called on game end
        socket.on(
            'scoreboard_update',
            (scoreBoard: {
                exitCode: number;
                results: { [id: string]: PlayerScore };
                errors: string;
                output: string;
            }) => {
                setState((s) => {
                    return {
                        ...s,
                        scoreBoard: scoreBoard.results,
                        round: { ...scoreBoard },
                        state: SessionState.waiting,
                    };
                });
            }
        );
        // host change
        socket.on('host_change', ({ host }: { host: string }) => {
            if (socket === null) return;
            if (host == socket.id) {
                // warn errors or some shit
                socket.on('start_failed', (data) => {
                    console.log(`Faield to start game\n`, data);
                });
            }
        });

        setSocket(socket);
    }, [setSocket]);

    const join = (name: string, code: number) => {
        if (socket !== null) socket.emit('join', { name, code });
    };

    const startGame = () => {
        if (socket === null || socket.id !== state.host) return;
        socket.emit('start_game');
    };

    const create = (name: string) => {
        if (socket === null) return;
        socket.emit('create', { name });
    };

    const submit = (code: string) => {
        if (socket !== null) socket.emit('submit', { code });
    };

    return [state, { join, startGame, create, submit }];
};
