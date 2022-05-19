import { useEffect, useState } from 'react';
import useMap, { MapState } from '../shared/map';
import useReplay, { ReplayState } from '../singleplayer/replay';
import { GameMap, GamePhase, PlayerResult, Spieler } from '../../shared/types';
import { Socket } from 'socket.io-client';

export interface Player extends Spieler {
    result: null | PlayerResult;
}

export type SessionState = {
    host: string;
    code: number;
    phase: GamePhase;
    waiting: number;
    players: Map<string, Player>;
};

export type MultiplayerState = {
    map: MapState;
    name: string;
    code: number;
    replay: ReplayState;
    session: SessionState;
    creating: boolean;
    playerCount: number;
    functions: {
        info: () => void;
        join: () => void;
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
    phase: GamePhase.disconnected,
    players: new Map(),
};

export const useMultiplayer = (
    socket: Socket | null,
    bind: (events: { [event: string]: (...args: any[]) => void }) => void
): MultiplayerState => {
    const map = useMap();
    const replay = useReplay({
        result: null,
        objects: map.viewMap.objects,
        walls: map.functions.getWalls(),
    });

    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<number>(0);
    const [creating, setCreating] = useState<boolean>(false);
    const [session, setSession] = useState<SessionState>(defaultSession);
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

    // phase change
    const changePhase = ({ phase }: { phase: GamePhase }) =>
        setSession((s) => ({ ...s, phase }));

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
    const onError = ({
        stderr,
        stdout,
    }: {
        stderr: string;
        stdout: string;
    }) => {
        console.log(stdout);
        console.error(stderr);
    };

    // player is ready (or not)
    const onPlayerReady = ({ id, isReady }: { id: string; isReady: boolean }) =>
        changePlayer(id, (p) => ({ ...p, isReady }));

    // on join
    const onFetch = ({
        map: _map,
        players,
        ...data
    }: {
        map: GameMap;
        code: number;
        host: string;
        phase: GamePhase;
        players: Spieler[];
    }) => {
        console.log(`Fetch called `, players);
        setSession((s) => ({
            ...s,
            ...data,
            // initialize players
            players: new Map(
                players.map((p) => [p.id, { ...p, result: null }])
            ),
        }));
        map.functions.set(_map);
    };

    // assign events to the client socket
    useEffect(() => {
        bind({
            map_update_type: ({ type }) => map.functions.setType(type),
            map_update_size: ({ width, height }) =>
                map.functions.setSize(width, height),
            map_update_load: ({ mapName }) => map.functions.loadMap(mapName),
            map_update_object: ({ position, field }) =>
                map.functions.setField(position, field),
            map_update_clear: map.functions.clearAll,

            // game state events
            game_host_change: onHostChange,
            game_phase_chage: changePhase,
            game_info_waiting: onWaitingChange,
            fetch: onFetch,

            // player events
            player_join: onPlayerJoin,
            player_leave: onPlayerLeave,
            player_ready: onPlayerReady,

            // game run events
            game_error: onError,
            game_end: () => {},
            info: onInfo,
        });
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
        socket?.emit('info', { code });
    };

    // join a session
    const join = () => {
        console.log('joining to ', code);
        if (code > 9999 || code < 1000 || isNaN(code))
            return void console.error('invalid code');

        const x = name.replaceAll(/[^a-zA-Z\d\-\.\_]/gm, '').substring(0, 50);
        if (!x.length) return void console.error('invalid name');

        socket?.emit('join', {
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
    const create = () => socket?.emit('create', { name });

    // leave a session
    const leave = () => {
        socket?.emit('exit');
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

    return {
        map,
        code,
        name,
        replay,
        creating,
        playerCount,
        session,
        functions: {
            info,
            join,
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
