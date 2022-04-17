import { useEffect, useState } from 'react';
import maps from '../front/maps';
import { GameMap } from '../shared/types';

export interface MapProps {
    map: GameMap;
    view: 'edit' | 'play';
}

// map config editor
const useMap = ({
    map,
    isHost,
}: {
    map: GameMap;
    isHost: boolean;
}): [
    MapProps,
    {
        getMap: () => GameMap;
        setSize: (size: 10 | 20 | 30 | 40) => void;
        setView: (view: 'edit' | 'play') => void;
        setBlock: (x: number, y: number, type: number) => void;
        clearAll: () => void;
        setType: (type: 'parse' | 'load') => void;
        loadMap: (name: string) => void;
        reset: (playback: GameMap) => void;
    }
] => {
    const [state, setState] = useState<MapProps>({
        view: 'play',
        map: {
            load: '0',
            size: 20,
            type: 'parse',
            objects: {},
        },
    });

    // change others' editor view
    useEffect(() => {
        if (isHost) return;
        setState((s) => {
            return {
                ...s,
                map,
            };
        });
    }, [map]);

    // clear the entire map
    const clearAll = (): void => {
        setState((s) => Object({ ...s, map: { ...s.map, objects: {} } }));
    };

    // set a block at a specific position
    const setBlock = (x: number, y: number, type: number): void => {
        console.log(x, y, type);
        setState((s) => {
            // delete field
            if (type === 0) {
                delete s.map.objects[`${x}-${y}`];
                return { ...s };
            }
            return {
                ...s,
                map: {
                    ...s.map,
                    objects: { ...s.map.objects, [`${x}-${y}`]: type },
                },
            };
        });
    };

    const setSize = (size: 10 | 20 | 30 | 40): void => {
        setState((s) => {
            return { ...s, map: { ...s.map, size } };
        });
    };

    const setView = (view: 'edit' | 'play'): void =>
        setState((s) => {
            return { ...s, view };
        });

    const setType = (type: 'parse' | 'load') => {
        setState((s) => {
            return { ...s, map: { ...s.map, type } };
        });
    };

    const loadMap = (name: string) => {
        setState((s) => {
            return {
                ...s,
                map: {
                    ...s.map,
                    type: 'load',
                    load: name,
                    objects: maps[name]?.objects ?? {},
                    size: maps[name]?.size ?? 10,
                },
            };
        });
    };

    // returns the current contents of the editor
    const getMap = (): GameMap => state.map;

    const reset = (playback: GameMap) =>
        setState((s) => {
            return { ...s, map: playback };
        });

    return [
        state,
        {
            clearAll,
            setBlock,
            setSize,
            setView,
            getMap,
            setType,
            loadMap,
            reset,
        },
    ];
};

export default useMap;
