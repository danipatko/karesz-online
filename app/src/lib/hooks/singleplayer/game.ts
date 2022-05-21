import { Socket } from 'socket.io-client';
import useMap, { MapState } from '../shared/map';
import { useContext, useEffect, useState } from 'react';
import { SpawnState, useSpawn } from './spawn';
import useReplay, { ReplayState } from './replay';
import { SingleResult } from '../../shared/types';
import { CommandResult } from '../../karesz/types';
import { useSocket } from '../shared/socket';

export type SingleState = {
    map: MapState;
    run: () => void;
    spawn: SpawnState;
    replay: ReplayState;
};

export const useSingleplayer = (code: string): SingleState => {
    const socket = useSocket();
    const [result, setResult] = useState<SingleResult | null>(null);
    const map: MapState = useMap();
    const spawn: SpawnState = useSpawn({
        width: map.current.width,
        height: map.current.height,
    });
    const replay: ReplayState = useReplay({
        walls: map.functions.getWalls(),
        result,
        objects: map.viewMap.objects,
    });

    useEffect(
        () =>
            void socket.on(
                'game_result_single',
                (result: CommandResult<null | SingleResult>) => {
                    console.log(result);
                    // TODO: do something with stdin/stderr
                    setResult(result.result);
                }
            ),
        [socket]
    );

    const run = () => {
        // set edited map as viewer map for replay
        map.functions.setViewMap(map.current);
        if (!socket) return void console.error('socket is undefined');
        socket.emit('run', {
            map: map.functions.get(),
            code,
            spawn: spawn.current,
        });
    };

    return { map, run, spawn, replay };
};
