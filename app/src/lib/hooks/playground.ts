import { useState } from 'react';
import host from '../host';
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
    logs: string;
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
    logs: '',
};

const usePlayground = (
    onError: (error: string) => void
): [
    PlaygroundState,
    {
        run: (code: string) => void;
        saveMap: (map: GameMap) => void;
        setStartingPoint: (x: number, y: number) => void;
        cycleStartingRotation: () => void;
    }
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
        const res = await fetch(`${window.origin}/api/sp/custom`, {
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
            setState((s) => {
                return {
                    ...s,
                    logs: `Bruh request died - [${res.status}] ${res.statusText}`,
                };
            });
            return;
        }

        const { steps, error } = await res.json();

        if (error !== undefined) {
            setState((s) => {
                return { ...s, logs: error };
            });
            return;
        }

        onError('Ready for replay');

        setState((s) => {
            return { ...s, steps };
        });
    };

    const saveMap = (map: GameMap) => {
        setState((s) => {
            return { ...s, map };
        });
    };

    const setStartingPoint = (x: number, y: number) => {
        setState((s) => {
            return { ...s, start: { ...s.start, x, y } };
        });
    };

    const cycleStartingRotation = () => {
        setState((s) => {
            return {
                ...s,
                start: { ...s.start, rotation: (s.start.rotation + 1) % 4 },
            };
        });
    };

    return [state, { run, saveMap, cycleStartingRotation, setStartingPoint }];
};

export default usePlayground;
