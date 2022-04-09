import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, IPlayer as Player } from '../shared/types';

// this is the struct returned by the runner
export interface ScoreBoard {
    players: {
        name: string;
        place: number;
        steps?: number[];
        kills: number;
        rounds_survived: number;
        reason_of_death: string;
    }[];
    winner: string;
    draw: boolean;
}

export interface Game {
    state: GameState; // current state
    code: number; // game code
    host: string; // the id of the host
    players: { [id: string]: Player };
    isHost: boolean;
}

export const useGame = (
    code: number,
    onError: (error: string) => void
): [
    Game,
    { create: boolean; inLobby: number },
    ScoreBoard | null,
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
    // basic info pre join
    const [meta, setMeta] = useState<{ create: boolean; inLobby: number }>({
        create: false,
        inLobby: 0,
    });
    // the game state
    const [state, setState] = useState<Game>({
        state: GameState.disconnected,
        code,
        host: '',
        players: {},
        isHost: false,
    });
    const [scoreboard, setScoreboard] = useState<ScoreBoard | null>(null);

    /* HANDLER FUNCTIONS */

    // emitted after joining session: contains the game host, players and code
    const fetch = (data: {
        host: string;
        players: { [id: string]: Player };
        code: number;
    }) =>
        setState({
            ...data,
            state: GameState.joined,
            isHost: data.host === socket?.id,
        });

    // emitted when the game starts or ends
    const stateUpdate = ({ state }: { state: number }) =>
        setState((s) => {
            return { ...s, state };
        });

    // emitted when a player joins
    const onJoin = (p: { name: string; id: string; ready: boolean }) =>
        setState((s) => {
            return {
                ...s,
                players: { ...s.players, [p.id]: { ...p, wins: 0 } },
            };
        });

    // emitted when a player leaves
    const onLeave = ({ id }: { id: string }) =>
        setState((s) => {
            onError(`${s.players[id]} has left the game.`);
            delete s.players[id];
            return { ...s };
        });

    // emitted when a player signals ready (or unready)
    const playerUpdate = ({ id, ready }: { id: string; ready: boolean }) => {
        console.log(`EV: player_update ${id} ${ready}`);
        setState((s) => {
            s.players[id].ready = ready;
            return { ...s };
        });
    };

    // emitted on scoreboard update
    const scoreboardUpdate = (scoreBoard: ScoreBoard) =>
        setScoreboard(scoreBoard);

    // emitted on a host change
    const onHostChange = ({ host }: { host: string }) =>
        setState((s) => {
            return { ...s, host, isHost: s.host === host };
        });

    // emitted when a player fetches info about a game (either not found or provided with the code and number of players)
    const onInfo = ({
        playerCount,
        found,
        code,
    }: {
        playerCount: number;
        found: boolean;
        code: number;
    }) => {
        setState((s) => {
            if (!found) {
                onError(`Game could not be found.`);
                return { ...s, state: GameState.disconnected };
            }
            setMeta((m) => Object({ ...m, inLobby: playerCount }));
            return {
                ...s,
                state: GameState.prejoin,
                code,
            };
        });
    };

    // init function
    useEffect(() => {
        const socket = io();
        /* BIND DEFAULT EVENTS TO SOCKET */

        // basic error handling
        socket.on('error', ({ error }: { error: string }) => onError(error));
        socket.on('fetch', fetch);
        socket.on('state_update', stateUpdate);
        socket.on('joined', onJoin);
        socket.on('left', onLeave);
        socket.on('player_update', playerUpdate);
        socket.on('scoreboard_update', scoreboardUpdate);
        socket.on('host_change', onHostChange);
        socket.on('info', onInfo);
        // TODO: show the compiler logs to the user to find the error
        socket.on('compile_error', (data) =>
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
        socket.emit(meta.create ? 'create' : 'join', {
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
        setMeta((m) => Object({ ...m, create: true }));
        setState((s) => Object({ ...s, state: GameState.prejoin }));
    };

    // create new game
    const create = (name: string) => {
        if (socket === null) return;
        console.log(`EM: create as ${name}`);
        socket.emit('create', { name });
    };

    // exit an existing session or just return to enter code
    const exit = () => {
        if (state.state !== GameState.disconnected && socket !== null)
            socket.emit('exit');
        setState((s) => {
            return { ...s, state: GameState.disconnected };
        });
    };

    return [
        state,
        meta,
        scoreboard,
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
