import { Socket } from 'socket.io';
import useMap, { MapState } from './map';
import { useEffect, useState } from 'react';
import { SpawnState, useSpawn } from './spawn';
import useReplay, { ReplayState } from './replay';
import { GameMap, SingleResult } from '../../shared/types';
import { CommandResult } from '../../karesz/types';

export type SingleState = {
    map: MapState;
    run: () => void;
    spawn: SpawnState;
    replay: ReplayState;
};

export const useSingleplayer = (socket: Socket, code: string): SingleState => {
    const [result, setResult] = useState<SingleResult | null>(null);
    const map: MapState = useMap();
    const spawn: SpawnState = useSpawn({
        height: map.current.height,
        width: map.current.width,
    });
    const replay: ReplayState = useReplay({
        objects: map.viewMap.objects,
        walls: map.functions.getWalls(),
        result,
    });

    useEffect(
        () =>
            void socket?.on(
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
        socket?.emit('run', {
            map: map.functions.get(),
            code,
            spawn: spawn.current,
        });
    };

    return { map, run, spawn, replay };
};
