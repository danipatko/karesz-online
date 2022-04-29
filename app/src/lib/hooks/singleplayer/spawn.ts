import { useState } from 'react';
export interface Spawn {
    x: number;
    y: number;
    rotation: number;
}

export type SpawnState = {
    current: Spawn;
    functions: {
        setPosition: (position: [number, number]) => void;
        setRotation: (rotation: number) => void;
    };
};

export const useSpawn = (): SpawnState => {
    const [spawn, setSpawn] = useState<Spawn>({ x: 0, y: 0, rotation: 0 });

    // set the spawn point in singleplayer
    const setPosition = (position: [number, number]) =>
        setSpawn((s) => ({ ...s, x: position[0], y: position[1] }));

    // set the spawn rotation in singleplayer
    const setRotation = (rotation: number) =>
        setSpawn((s) => ({ ...s, rotation }));

    return { current: spawn, functions: { setPosition, setRotation } };
};
