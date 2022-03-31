import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Player {
    name: string; // display name
    id: string; // socket id
    ready: boolean; // submitted code and ready
    wins: number; // win count
}

export enum GameState {
    disconnected = 0, // not initted
    notfound = 1, // if game is not found
    prejoin = 2, // code is correct, promt name
    joined = 3, // idle
    running = 4, // game is running
}

// this is the struct returned by the runner
export interface ScoreBoard {
    players: {
        name: string;
        place: number;
        steps: number[];
        kills: number;
        rounds_survived: number;
        reason_of_death: string;
    }[];
    winner: string;
    draw: boolean;
}

export interface Game {
    connected: boolean; // connected to server
    players: { [id: string]: Player };
    code: number; // game code
    host: string; // the id of the host
    state: GameState; // current state
    scoreBoard: ScoreBoard;
    playerCount: number;
}

export const useGame = (
    code: number
): [
    Game,
    {
        startGame: () => void;
        submit: (s: string) => void;
        prejoin: (code: number) => void;
        join: (name: string) => void;
    }
] => {
    const [socket, setSocket] = useState<Socket>(null as any);
    const [state, setState] = useState<Game>({
        connected: false,
        state: GameState.disconnected,
        code,
        host: '',
        players: {},
        scoreBoard: {
            draw: false,
            players: [],
            winner: '',
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
                        playerCount: s.playerCount,
                        scoreBoard: s.scoreBoard,
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
        socket.on('scoreboard_update', (scoreBoard: ScoreBoard) => {
            setState((s) => {
                return {
                    ...s,
                    scoreBoard,
                };
            });
        });
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

        setSocket(socket);
    }, [setSocket]);

    // start game (as host)
    const startGame = () => {
        if (socket === null || socket.id !== state.host) return;
        socket.emit('start_game');
    };

    // enter the display name for a pending game join
    const join = (name: string) => {
        if (socket === null) return;

        socket.emit(code == 0 ? 'create' : 'join', {
            name,
            code,
        });
    };

    // upload code to server
    const submit = (code: string) => {
        if (socket !== null) socket.emit('submit', { code });
    };

    // enter code for game
    const prejoin = (code: number) => {
        if (socket === null) return;
        socket.emit('prejoin', { code });
    };

    return [state, { startGame, submit, prejoin, join }];
};
