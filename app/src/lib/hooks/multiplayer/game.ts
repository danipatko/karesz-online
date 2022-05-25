import { clamp } from '../shared/replay';
import { useEffect, useState } from 'react';
import useMap, { MapState } from '../shared/map';
import {
    GamePhase,
    IGameMap,
    MultiResult,
    PlayerResult,
    Spieler,
} from '../../shared/types';
import { useSocket } from '../shared/socket';
import { CommandResult } from '../../karesz/types';
import useMultiReplay, { MultiReplayState } from './replay';

export interface Player extends Spieler {
    result: null | PlayerResult;
}

export type SessionState = {
    host: string;
    code: number;
    phase: GamePhase;
    waiting: number;
    isReady: boolean;
    players: Map<string, Player>;
};

export type MultiplayerState = {
    map: MapState;
    name: string;
    code: number;
    isHost: boolean;
    replay: MultiReplayState;
    session: SessionState;
    players: [string, Player][];
    creating: boolean;
    output: { stdout: string; stderr: string };
    playerCount: number;
    functions: {
        info: () => void;
        join: () => void;
        ready: () => void;
        leave: () => void;
        create: () => void;
        preJoin: () => void;
        setName: (name: string) => void;
        setCode: (code: string) => void;
        promtName: () => void;
        handleSubmit: () => void;
    };
};

export const defaultSession: SessionState = {
    code: -1,
    host: '',
    waiting: 0,
    isReady: false,
    phase: GamePhase.disconnected,
    players: new Map(),
};

export const useMultiplayer = (editor: string): MultiplayerState => {
    const socket = useSocket();
    const map = useMap((ev, data) => socket.emit(ev, data));
    const [result, setResult] = useState<MultiResult | null>(null);
    const replay = useMultiReplay({
        result,
        objects: map.viewMap.objects,
        walls: map.functions.getWalls(),
    });

    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<number>(0);
    const [output, setOutput] = useState<{ stderr: string; stdout: string }>({
        stderr: '',
        stdout: '',
    });
    const [session, setSession] = useState<SessionState>(defaultSession);
    const [creating, setCreating] = useState<boolean>(false);
    const [playerCount, setPlayerCount] = useState<number>(0);

    // wrapper function for modifiying player data
    const changePlayer = (id: string, callback: (player: Player) => Player) => {
        setSession((s) => {
            let player = s.players.get(id);
            if (player) {
                player = callback(player);
                s.players.set(id, player);
            }
            return { ...s };
        });
    };

    const resetWarnings = () =>
        setSession((s) => {
            for (let [id, player] of s.players.entries()) {
                player.warning = false;
                player.error = false;
                s.players.set(id, player);
            }
            return { ...s };
        });

    // phase change
    const changePhase = ({ phase }: { phase: GamePhase }) =>
        setSession((s) => {
            if (phase === GamePhase.running) resetWarnings();
            return { ...s, phase };
        });

    // host change
    const onHostChange = ({ host }: { host: string }) =>
        setSession((s) => ({ ...s, host }));

    // waiting status (when a player is ready)
    const onWaitingChange = ({ waiting }: { waiting: number }) =>
        setSession((s) => ({ ...s, waiting }));

    // when a player joins
    const onPlayerJoin = (player: Spieler) =>
        setSession((s) => {
            s.players.set(player.id, { ...player, result: null });
            return { ...s };
        });

    // when a player leaves
    const onPlayerLeave = ({ id }: { id: string }) =>
        setSession((s) => {
            s.players.delete(id);
            return { ...s };
        });

    // when the code fails to execute
    const onError = (out: { stderr: string; stdout: string }) => {
        resetSession();
        setOutput(out);
        console.log(out.stdout);
        console.error(out.stderr);
    };

    // player is ready (or not)
    const onPlayerReady = ({
        id,
        isReady,
    }: {
        id: string;
        isReady: boolean;
    }) => {
        console.log('recevied player ready', socket.id, id);
        // set own status
        if (id === socket.id) setSession((s) => ({ ...s, isReady }));
        changePlayer(id, (p) => ({ ...p, isReady }));
    };

    const onPlayerWarn = ({ id }: { id: string }) => {
        changePlayer(id, (p) => ({ ...p, warning: true }));
    };

    const onPlayerError = ({ id }: { id: string }) => {
        changePlayer(id, (p) => ({ ...p, error: true }));
    };

    // on join
    const onFetch = ({
        map: _map,
        players,
        ...data
    }: {
        map: IGameMap;
        code: number;
        host: string;
        phase: GamePhase;
        players: Spieler[];
    }) => {
        setSession((s) => ({
            ...s,
            ...data,
            // initialize players
            players: new Map(
                players.map((p) => [p.id, { ...p, result: null }])
            ),
        }));
        map.functions.set({ ..._map, objects: new Map(_map.objects) });
    };

    // remove player warnings, errors, etc. and set phase to idle
    const resetSession = () =>
        setSession((s) => {
            for (let [id, player] of s.players.entries()) {
                player.isReady = false;
                player.result = null; // get from result
                s.players.set(id, player);
            }
            return { ...s, phase: GamePhase.idle, isReady: false };
        });

    const onGameEnd = (data: CommandResult<MultiResult>) => {
        resetSession();

        // update results of players
        for (const id in data.result.players) {
            changePlayer(id, (p) => ({
                ...p,
                result: data.result.players[id],
            }));
        }

        // TOFIX: setView won't work
        map.functions.setToView();
        setResult(data.result);
        setOutput({ stdout: data.stdout, stderr: data.stderr });
        console.log('RECEIVED GAME END', data);
    };

    // assign events to the client socket
    useEffect(() => {
        // bind map events
        socket.on('map_update_type', ({ type }) => map.functions.setType(type));
        socket.on('map_update_size', ({ width, height }) =>
            map.functions.setSize(width, height)
        );
        socket.on('map_update_load', ({ mapName }) =>
            map.functions.loadMap(mapName)
        );
        socket.on('map_update_object', ({ position, field }) =>
            map.functions.setField(position, field)
        );
        socket.on('map_update_clear', map.functions.clearAll);

        // game state events
        socket.on('game_host_change', onHostChange);
        socket.on('game_phase_change', changePhase);
        socket.on('game_info_waiting', onWaitingChange);
        socket.on('fetch', onFetch);

        // player events
        socket.on('player_join', onPlayerJoin);
        socket.on('player_leave', onPlayerLeave);
        socket.on('player_ready', onPlayerReady);
        socket.on('player_warn', onPlayerWarn);
        socket.on('player_error', onPlayerError);

        // game run events
        socket.on('game_error', onError);
        socket.on('game_end', onGameEnd);

        // other
        socket.on('info', onInfo);
        socket.on('error', ({ message }: { message: string }) =>
            console.error(message)
        );
        socket.on('warn', ({ message }: { message: string }) =>
            console.warn(message)
        );
    }, []);

    // handle info fetch
    const onInfo = ({
        found,
        playerCount,
    }: {
        found: boolean;
        playerCount?: number;
    }) => {
        if (!found || playerCount === undefined) {
            setCode(0);
            return void console.error('game not found');
        }
        setPlayerCount(playerCount);
        promtName();
    };

    // reset session
    const exit = () => {
        setCode(0);
        setName('');
        setPlayerCount(0);
        setSession(defaultSession);
    };

    // get information about a session (does it exist, player count)
    const info = () => {
        setCreating(false);
        socket.emit('info', { code });
    };

    // join a session
    const join = () => {
        console.log('joining to ', code);
        if (code > 9999 || code < 1000 || isNaN(code))
            return void console.error('invalid code');

        const x = name.replaceAll(/[^a-zA-Z\d\-\.\_]/gm, '').substring(0, 50);
        if (!x.length) return void console.error('invalid name');

        socket.emit('join', {
            name: x,
            code,
        });
    };

    const preJoin = () => {
        setCreating(true);
        promtName();
    };

    // prejoin screen
    const promtName = () =>
        setSession((s) => ({ ...s, phase: GamePhase.prejoin }));

    // create new session
    const create = () => socket.emit('create', { name });

    // leave a session
    const leave = () => {
        socket.emit('exit');
        exit();
    };

    // start a session
    const handleSubmit = () => {
        if (code == 0) create();
        else join();
    };

    // parse code from input
    const onCodeChange = (code: string) => {
        const x = code.replace(/[^\d]/gm, '').substring(0, 4);
        setCode(Number(x));
    };

    // get sorted scoreboard
    const getScoreboard = (): [string, Player][] => {
        return Array.from(session.players.entries()).sort((a, b) =>
            // no results yet
            !(a[1].result && b[1].result)
                ? 1
                : // sort by placement
                  clamp(a[1].result.placement - b[1].result.placement, -1, 1)
        );
    };

    // ready up
    const ready = () => {
        socket.emit('player_ready', { code: editor });
    };

    return {
        map,
        code,
        name,
        isHost: session.host === socket.id,
        replay,
        output,
        session,
        players: getScoreboard(),
        creating,
        playerCount,
        functions: {
            info,
            join,
            ready,
            leave,
            create,
            preJoin,
            setCode: onCodeChange,
            setName,
            promtName,
            handleSubmit,
        },
    };
};
