import { clamp } from '../shared/replay';
import useMap, { MapState } from '../shared/map';
import { useEffect, useState } from 'react';
import { SocketState } from '../shared/socket';
import { GameMap, GamePhase, PlayerResult, Spieler } from '../../shared/types';
import useReplay, { ReplayState } from '../singleplayer/replay';

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
    playerCount: number;
    functions: {
        info: () => void;
        join: () => void;
        leave: () => void;
        create: () => void;
        setName: (name: string) => void;
        setCode: (code: string) => void;
        promtName: () => void;
    };
};

export const defaultSession: SessionState = {
    code: -1,
    host: '',
    waiting: 0,
    phase: GamePhase.disconnected,
    players: new Map(),
};

export const useMultiplayer = (socket: SocketState): MultiplayerState => {
    const map = useMap();
    const replay = useReplay({
        result: null,
        objects: map.viewMap.objects,
        walls: map.functions.getWalls(),
    });

    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<number>(0);
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
        // map events (changes are made in the editor map)
        socket.bind('map_update_type', ({ type }) =>
            map.functions.setType(type)
        );
        socket.bind('map_update_size', ({ width, height }) =>
            map.functions.setSize(width, height)
        );
        socket.bind('map_update_load', ({ mapName }) =>
            map.functions.loadMap(mapName)
        );
        socket.bind('map_update_object', ({ position, field }) =>
            map.functions.setField(position, field)
        );
        socket.bind('map_update_clear', () => map.functions.clearAll());

        // game state events
        socket.bind('game_host_change', onHostChange);
        socket.bind('game_phase_chage', changePhase);
        socket.bind('game_info_waiting', onWaitingChange);
        socket.bind('fetch', onFetch);

        // player events
        socket.bind('player_join', onPlayerJoin);
        socket.bind('player_leave', onPlayerLeave);
        socket.bind('player_ready', onPlayerReady);

        // game run events
        socket.bind('game_error', onError);
        socket.bind('game_end', (data: any) => {
            console.log(data);
            map.functions.setToView();
        });

        // other
        socket.bind('info', onInfo);
    }, [socket]);

    // handle info fetch
    const onInfo = ({
        found,
        playerCount,
    }: {
        found: boolean;
        playerCount?: number;
    }) => {
        if (!found || playerCount === undefined)
            return void console.error('game not found');
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
    const info = () => socket.socket?.emit('info', { code });

    // join a session
    const join = () => {
        if (code > 9999 || code < 1000 || isNaN(code))
            return void console.error('invalid code');

        socket.socket?.emit('join', {
            name: name,
            code,
        });
    };

    // prejoin screen
    const promtName = () =>
        setSession((s) => ({ ...s, phase: GamePhase.prejoin }));

    // create new session
    const create = () => socket.socket?.emit('create', { name });

    // leave a session
    const leave = () => {
        socket.socket?.emit('exit');
        exit();
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
        playerCount,
        session,
        functions: {
            info,
            join,
            leave,
            create,
            setCode: onCodeChange,
            setName,
            promtName,
        },
    };
};
