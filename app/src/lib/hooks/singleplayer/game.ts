import { Socket } from 'socket.io';
import useMap, { MapState } from './map';
import { useEffect, useState } from 'react';
import { SpawnState, useSpawn } from './spawn';
import useReplay, { ReplayState } from './replay';
import { SingleResult } from '../../shared/types';
import { CommandResult } from '../../karesz/types';

export const useSingleplayer = (socket: Socket) => {
    const [result, setResult] = useState<SingleResult | null>(null);
    const map: MapState = useMap();
    const spawn: SpawnState = useSpawn();
    const replay: ReplayState = useReplay({
        objects: map.current.objects,
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

    const run = (code: string) => {
        socket?.emit('run', { code, map: map.current, spawn: spawn.current });
    };

    return { map, run, spawn, replay };
};
