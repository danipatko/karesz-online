import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameMap, GameState, IPlayer as Player } from '../shared/types';

// this is the struct returned by the runner
export interface Scoreboard {
    draw: boolean;
    winner: string;
    rounds: number;
    players: {
        [id: string]: {
            name: string;
            kills: number;
            steps: number[];
            death: string;
            start: {
                x: number;
                y: number;
                rotation: number;
            };
            survived: number;
            placement: number;
        };
    };
}

export interface Game {
    state: GameState; // current state
    code: number; // game code
    host: string; // the id of the host
    error: string;
    isHost: boolean; // is the player the host
    players: { [id: string]: Player }; // all players in lobby
    // info about the map
    map: {
        size: number;
        load: string;
        type: 'load' | 'parse';
        objects: { [key: string]: number };
    };
}

const defaults: Game = {
    state: GameState.disconnected,
    code: 0,
    host: '',
    error: '',
    players: {},
    isHost: false,
    map: {
        load: '',
        type: 'parse',
        size: 20,
        objects: {},
    },
};

export const useGame = (
    code: number,
    warn: (error: string) => void
): [
    Game,
    { create: boolean; inLobby: number },
    Scoreboard | null,
    {
        exit: () => void;
        join: (name: string) => void;
        isHost: () => boolean;
        isReady: () => boolean;
        submit: (s: string) => void;
        create: (name: string) => void;
        preJoin: (code: number) => void;
        startGame: () => void;
        preCreate: () => void;
        updateMap: (map: GameMap) => void;
    }
] => {
    const [socket, setSocket] = useState<Socket>(null as any);
    // basic info pre join
    const [meta, setMeta] = useState<{ create: boolean; inLobby: number }>({
        create: false,
        inLobby: 0,
    });
    // the game state
    const [state, setState] = useState<Game>({ ...defaults, code });
    const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null);

    /* HANDLER FUNCTIONS */

    // emitted after joining session: contains the game host, players and code
    const fetch = (data: {
        map: GameMap;
        host: string;
        players: { [id: string]: Player };
        code: number;
    }) =>
        setState((s) => {
            return {
                ...s,
                ...data,
                state: GameState.idle,
                isHost: data.host === socket?.id,
            };
        });

    // emitted when the game starts or ends
    const stateUpdate = ({ state: st }: { state: number }) => {
        setState((s) => {
            return { ...s, state: st };
        });
    };
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
            warn(`${s.players[id]?.name ?? 'A player'} has left the game.`);
            delete s.players[id];
            return { ...s };
        });

    // emitted when a player signals ready (or unready)
    const playerUpdate = ({ id, ready }: { id: string; ready: boolean }) => {
        // console.log(`EV: player_update ${id} ${ready}`);
        setState((s) => {
            s.players[id].ready = ready;
            return { ...s };
        });
    };

    // emitted on game end
    const onGameEnd = (sb: Scoreboard) => {
        setState((s) => {
            for (const id in s.players) s.players[id].ready = false;
            if (s.players.hasOwnProperty(sb.winner)) {
                s.players[sb.winner].wins++;
                sb.winner = s.players[sb.winner].name;
            }
            return { ...s };
        });
        setScoreboard(sb);
    };

    // emitted on a host change
    const onHostChange = ({ host }: { host: string }) => {
        setState((s) => {
            return { ...s, host, isHost: s.host === host };
        });
        setTimeout(() => {
            if (isHost()) warn('You are now the host of this game.');
        }, 200);
    };

    // emitted when a player fetches info about a game (either not found or provided with the code and number of players)
    const onInfo = ({
        code,
        found,
        playerCount,
    }: {
        code: number;
        found: boolean;
        playerCount: number;
    }) => {
        setState((s) => {
            if (!found) {
                warn(`Game could not be found.`);
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

    const onMapUpdate = ({ map }: { map: GameMap }) => {
        setState((s) => {
            return { ...s, map };
        });
    };

    const onCompileError = ({ error }: { error: string }) => {
        setState((s) => {
            return { ...s, error };
        });
    };

    const onUnready = () => {
        setState((s) => {
            for (const id in s.players) s.players[id].ready = false;
            return { ...s };
        });
    };

    // init function
    useEffect(() => {
        const socket = io();
        /* BIND DEFAULT EVENTS TO SOCKET */

        // basic error handling
        socket.on('info', onInfo);
        socket.on('left', onLeave);
        socket.on('error', ({ error }: { error: string }) => warn(error));
        socket.on('fetch', fetch);
        socket.on('joined', onJoin);
        socket.on('unready', onUnready);
        socket.on('game_end', onGameEnd);
        socket.on('map_update', onMapUpdate);
        socket.on('host_change', onHostChange);
        socket.on('state_update', stateUpdate);
        socket.on('player_update', playerUpdate);
        socket.on('compile_error', onCompileError);
        socket.on('disconnect', reset);

        setSocket(socket);
    }, [setSocket]);

    // reset game parameters to defaults
    const reset = () => {
        setState(defaults);
        setScoreboard(null);
        setMeta({
            create: false,
            inLobby: 0,
        });
    };

    // start game (as host)
    const startGame = () => {
        if (socket === null || socket.id !== state.host) return;
        // console.log(`EM: startGame`);
        socket.emit('start_game');
    };

    // update the starting map state
    const updateMap = (map: GameMap) => {
        // console.log(`EM: uploadMap`);
        socket.emit('update_map', map);
    };

    // enter the display name for a pending game join
    const join = (name: string) => {
        if (socket === null) return;
        // console.log(`EM: join as ${name}`);
        if (!name.replace(/[^a-zA-Z\d\-\.\_]/gm, '').length) {
            warn('Please enter a valid name.');
            return;
        }
        socket.emit(meta.create ? 'create' : 'join', {
            name,
            code: state.code,
        });
    };

    // upload code to server
    const submit = (code: string) => {
        // console.log(`EM: submit ${code}`);
        if (socket !== null) {
            if (isReady()) socket.emit('unsubmit');
            else socket.emit('submit', { code });
        }
    };

    // enter code for game
    const preJoin = (code: number) => {
        if (socket === null) return;
        // console.log(`EM: preJoin ${code}`);
        socket.emit('info', { code });
    };

    // create new game
    const preCreate = () => {
        // console.log(`EM: preCreate`);
        setMeta((m) => Object({ ...m, create: true }));
        setState((s) => Object({ ...s, state: GameState.prejoin }));
    };

    // create new game
    const create = (name: string) => {
        if (socket === null) return;
        // console.log(`EM: create as ${name}`);
        socket.emit('create', { name });
    };

    // exit an existing session or just return to enter code
    const exit = () => {
        if (state.state !== GameState.disconnected && socket !== null)
            socket.emit('exit');
        reset();
    };

    const isHost = (): boolean => state.host === socket?.id;

    const isReady = (): boolean => state.players[socket?.id]?.ready;

    return [
        state,
        meta,
        scoreboard,
        {
            join,
            exit,
            create,
            isHost,
            submit,
            isReady,
            preJoin,
            preCreate,
            startGame,
            updateMap,
        },
    ];
};
