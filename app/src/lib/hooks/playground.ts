import { useState } from 'react';
import { GameMap } from '../shared/types';

export interface PlaygroundState {
    map: GameMap; // the map
    // the player's starting position
    start: {
        x: number;
        y: number;
        rotation: number;
    };
    steps: number[];
}

const defaults: PlaygroundState = {
    map: {
        load: '',
        objects: {},
        size: 20,
        type: 'parse',
    },
    start: {
        x: 0,
        y: 0,
        rotation: 2,
    },
    steps: [],
};

const usePlayground = (): [
    PlaygroundState,
    { run: (code: string) => void; saveMap: (map: GameMap) => void }
] => {
    const [state, setState] = useState<PlaygroundState>(defaults);

    const getMap = () => {
        let result = '';
        for (let y = 0; y < state.map.size; y++) {
            for (let x = 0; x < state.map.size; x++)
                result += state.map.objects[`${x}-${y}`] ?? '0';
            result += '%0A';
        }
        return result.substring(0, result.length - 3);
    };

    const run = async (code: string) => {
        // TODO: configurable url
        const res = await fetch(`http://127.0.0.1:8000/sp/custom`, {
            method: 'POST',
            body: JSON.stringify({
                map: getMap(),
                code: code.replaceAll('\n', '%0A'),
                size_x: state.map.size,
                size_y: state.map.size,
                start_x: state.start.x,
                start_y: state.start.y,
                rotation: state.start.rotation,
            }),
        });

        if (!res.ok) {
            alert(`[${res.status}] ${res.statusText}`);
            return;
        }

        const { steps } = await res.json();
        console.log(steps);

        setState((s) => {
            return { ...s, steps };
        });
    };

    const saveMap = (map: GameMap) => {
        setState((s) => {
            return { ...s, map };
        });
    };

    return [state, { run, saveMap }];
};

export default usePlayground;
