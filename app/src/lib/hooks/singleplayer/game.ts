import { Socket } from 'socket.io';
import useMap, { MapState } from './map';
import { useEffect, useState } from 'react';
import { SpawnState, useSpawn } from './spawn';
import useReplay, { ReplayState } from './replay';
import { SingleResult } from '../../shared/types';

export const useSingleplayer = (socket: Socket) => {
    const [result, setResult] = useState<SingleResult>(null as any);
    const map: MapState = useMap();
    const spawn: SpawnState = useSpawn();
    const replay: ReplayState = useReplay({
        objects: map[0].objects,
        walls: map[2].getWalls(),
        result,
    });

    useEffect(
        () =>
            void socket?.on('game_result_single', (res: SingleResult) =>
                setResult(res)
            ),
        []
    );

    const run = () => {
        socket?.emit('run', { map });
    };

    return [map, replay, spawn, run];
};
