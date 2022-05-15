import { useEffect, useState } from 'react';
import { SocketState } from '../shared/socket';
import { MapState } from '../shared/map';
import { GameMap, GamePhase, PlayerResult, Spieler } from '../../shared/types';

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

export const useMultiplayer = (socket: SocketState, map: MapState) => {
    const [session, setSession] = useState<SessionState>({
        code: -1,
        host: '',
        waiting: 0,
        phase: GamePhase.disconnected,
        players: new Map(),
    });

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
    const onPlayerReady = ({ id, ready }: { id: string; ready: boolean }) =>
        changePlayer(id, (p) => ({ ...p, isReady: ready }));

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
        // map events
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
        //
    }, [socket]);

    return 0;
};
