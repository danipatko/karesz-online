import { useEffect, useState } from 'react';
import { useSocket } from '../shared/socket';
import { SpawnState, useSpawn } from './spawn';
import useMap, { MapState } from '../shared/map';
import useReplay, { ReplayState } from './replay';
import { SingleResult } from '../../shared/types';
import { CommandResult } from '../../karesz/types';

export type SingleState = {
    map: MapState;
    run: () => void;
    spawn: SpawnState;
    replay: ReplayState;
    output: { stderr: string; stdout: string };
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
    const [output, setOutput] = useState<{ stderr: string; stdout: string }>({
        stderr: '',
        stdout: '',
    });

    useEffect(() => {
        socket.on(
            'game_result_single',
            (result: CommandResult<null | SingleResult>) => {
                setResult(result.result);
                setOutput({ stderr: result.stderr, stdout: result.stdout });
                map.functions.setToView();
            }
        );
        socket.on(
            'game_error_single',
            (_output: { stderr: string; stdout: string }) => setOutput(_output)
        );
    }, [socket]);

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

    return { map, run, spawn, replay, output };
};
