import { PlayerScore, SessionState } from '../karesz/core/types';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Player {
    name: string;
    id: string;
    ready: boolean;
    wins: number;
}

export enum GameState {
    notfound = 0,
    prejoin = 1,
    joined = 2,
    running = 3,
}

export interface Game {
    connected: boolean;
    players: { [id: string]: Player };
    code: number;
    host: string;
    state: GameState;
    round: {
        exitCode: number;
        errors: string;
        output: string;
    };
    scoreBoard: { [id: string]: PlayerScore };
    playerCount: number;
}

export const useGame = (
    code: number
): [
    Game,
    {
        startGame: () => void;
        submit: (s: string) => void;
        join: (name: string) => void;
    }
] => {
    const [socket, setSocket] = useState<Socket>(null as any);
    const [state, setState] = useState<Game>({
        connected: false,
        state: GameState.notfound,
        code,
        host: '',
        players: {},
        scoreBoard: {},
        round: {
            errors: '',
            exitCode: -1,
            output: '',
        },
        playerCount: 0,
    });

    // init function
    useEffect(() => {
        const socket = io();
        // called after joining
        socket.on(
            'fetch',
            (data: {
                host: string;
                players: { [id: string]: Player };
                code: number;
            }) => {
                setState((s) => {
                    return {
                        ...data,
                        state: GameState.joined,
                        connected: true,
                        scoreBoard: {},
                        round: { errors: '', exitCode: -1, output: '' },
                        playerCount: s.playerCount,
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
        // choose a username
        socket.on('prejoin', ({ playerCount }: { playerCount: number }) => {
            console.log(`Prejoin count: ${playerCount} code: ${code} ------`);
            setState((s) => {
                return {
                    ...s,
                    playerCount,
                    state:
                        playerCount < 0
                            ? GameState.notfound
                            : GameState.prejoin,
                };
            });
        });

        socket.emit('prejoin', { code });

        setSocket(socket);
    }, [setSocket]);

    const startGame = () => {
        if (socket === null || socket.id !== state.host) return;
        socket.emit('start_game');
    };

    const join = (name: string) => {
        if (socket === null) return;

        socket.emit(code == 0 ? 'create' : 'join', {
            name,
            code,
        });
    };

    const submit = (code: string) => {
        if (socket !== null) socket.emit('submit', { code });
    };

    return [state, { startGame, submit, join }];
};
