import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, IPlayer as Player } from '../shared/types';

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
    modeCreate: boolean; // if the game is being created
}

export const useGame = (
    code: number,
    onError: (error: string) => void
): [
    Game,
    {
        startGame: () => void;
        submit: (s: string) => void;
        preJoin: (code: number) => void;
        join: (name: string) => void;
        create: (name: string) => void;
        preCreate: () => void;
        exit: () => void;
    }
] => {
    const [socket, setSocket] = useState<Socket>(null as any);
    const [state, setState] = useState<Game>({
        connected: false,
        state: GameState.disconnected,
        modeCreate: false,
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
        /* BIND DEFAULT EVENTS TO SOCKET */

        // basic error handling
        socket.on('error', ({ error }: { error: string }) => onError(error));

        // called after joining
        socket.on(
            'fetch',
            (data: {
                host: string;
                players: { [id: string]: Player };
                code: number;
            }) => {
                console.log(`EV: fetch ${JSON.stringify(data)}`);
                setState((s) => {
                    return {
                        ...s,
                        ...data,
                        state: GameState.joined,
                        connected: true,
                    };
                });
                // */
            }
        );

        // called on phase update
        socket.on('state_update', ({ state: _state }: { state: number }) => {
            console.log(`EV: state_update ${_state}`);
            setState((s) => {
                return { ...s, state: _state };
            });
        });

        // called when a player joins
        socket.on(
            'joined',
            (p: { name: string; id: string; ready: boolean; wins: number }) => {
                console.log(`EV: joined ${JSON.stringify(p)}`);
                setState((s) => {
                    s.players[p.id] = p;
                    return { ...s };
                });
            }
        );

        // called when a player leaves
        socket.on('left', ({ id }: { id: string }) => {
            console.log(`EV: left ${id}`);
            setState((s) => {
                delete s.players[id];
                return { ...s };
            });
        });

        // called when a player signals ready (or unready)
        socket.on(
            'player_update',
            ({ id, ready }: { id: string; ready: boolean }) => {
                console.log(`EV: player_update ${id} ${ready}`);
                setState((s) => {
                    s.players[id].ready = ready;
                    return { ...s };
                });
            }
        );

        // called on game end
        socket.on('scoreboard_update', (scoreBoard: ScoreBoard) => {
            console.log(`EV: scoreboard_update ${JSON.stringify(scoreBoard)}`);
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
            console.log(`EV: host_change ${host}`);

            setState((s) => {
                return { ...s, host };
            });
            // TODO: alert user about becoming host
        });

        // check if a game exists and how many players are in it
        socket.on(
            'info',
            ({
                playerCount,
                found,
                code,
            }: {
                playerCount: number;
                found: boolean;
                code: number;
            }) => {
                console.log(`EV: info found: ${found} ${playerCount} ${code}`);
                setState((s) => {
                    if (!found) {
                        onError(`Game could not be found.`);
                        return { ...s, state: GameState.notfound };
                    } else
                        return {
                            ...s,
                            playerCount,
                            state: GameState.prejoin,
                            code,
                        };
                });
            }
        );

        // called when the game is started but failed to execute
        socket.on('start_failed', (data) =>
            console.log(`Faield to start game\n`, data)
        );

        setSocket(socket);
    }, [setSocket]);

    // start game (as host)
    const startGame = () => {
        if (socket === null || socket.id !== state.host) return;
        console.log(`EM: startGame`);
        socket.emit('start_game');
    };

    // enter the display name for a pending game join
    const join = (name: string) => {
        if (socket === null) return;
        console.log(`EM: join as ${name}`);
        if (!name.replace(/[^a-zA-Z\d\-\.\_]/gm, '').length) {
            onError('Please enter a valid name.');
            return;
        }
        socket.emit(state.modeCreate ? 'create' : 'join', {
            name,
            code: state.code,
        });
    };

    // upload code to server
    const submit = (code: string) => {
        console.log(`EM: submit ${code}`);
        if (socket !== null) socket.emit('submit', { code });
    };

    // enter code for game
    const preJoin = (code: number) => {
        if (socket === null) return;
        console.log(`EM: preJoin ${code}`);
        socket.emit('info', { code });
    };

    // create new game
    const preCreate = () => {
        console.log(`EM: preCreate`);
        setState((s) => {
            return { ...s, state: GameState.prejoin, modeCreate: true };
        });
    };

    // create new game
    const create = (name: string) => {
        if (socket === null) return;
        console.log(`EM: create as ${name}`);
        socket.emit('create', { name });
    };

    // exit an existing session or just return to enter code
    const exit = () => {
        console.log(`EM: exit`);
        if (state.connected && socket != null) socket.emit('exit');
        setState((s) => {
            return { ...s, state: GameState.disconnected };
        });
    };

    return [
        state,
        {
            startGame,
            submit,
            preJoin,
            join,
            preCreate,
            create,
            exit,
        },
    ];
};
