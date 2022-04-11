import { useState } from 'react';

interface MapProps {
    size: 10 | 20 | 30 | 40;
    view: 'edit' | 'play';
    objects: { [key: string]: number };
}

// map config editor
const useMap = (): [
    MapProps,
    {
        getMap: () => { map: { [key: string]: number }; size: number };
        setSize: (size: 10 | 20 | 30 | 40) => void;
        setView: (view: 'edit' | 'play') => void;
        setBlock: (x: number, y: number, type: number) => void;
        clearAll: () => void;
    }
] => {
    const [state, setState] = useState<MapProps>({
        size: 20,
        view: 'edit',
        objects: {},
    });

    // clear the entire map
    const clearAll = (): void => {
        setState((s) => Object({ ...s, objects: {}, walls: {} }));
    };

    // set a block at a specific position
    const setBlock = (x: number, y: number, type: number): void => {
        console.log(x, y, type);
        setState((s) => {
            // delete field
            if (type === 0) {
                delete s.objects[`${x}-${y}`];
                return { ...s };
            }
            return {
                ...s,
                objects: { ...s.objects, [`${x}-${y}`]: type },
            };
        });
    };

    const setSize = (size: 10 | 20 | 30 | 40): void => {
        setState((s) => {
            return { ...s, size };
        });
    };

    const setView = (view: 'edit' | 'play'): void =>
        setState((s) => {
            return { ...s, view };
        });

    // returns the current contents of the editor
    const getMap = (): { map: { [key: string]: number }; size: number } => {
        return { map: state.objects, size: state.size };
    };

    return [state, { clearAll, setBlock, setSize, setView, getMap }];
};

export default useMap;
