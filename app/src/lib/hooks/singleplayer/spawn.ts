import { Dispatch, SetStateAction, useState } from 'react';
export interface Spawn {
    x: number;
    y: number;
    rotation: number;
}

export type SpawnState = {
    current: Spawn;
    choosing: boolean;
    functions: {
        setX: (x: number) => void;
        setY: (y: number) => void;
        setChoosing: Dispatch<SetStateAction<boolean>>;
        setPosition: (position: [number, number]) => void;
        setRotation: (rotation: number) => void;
    };
};

const clamp = (value: number, min: number, max: number) =>
    isNaN(value) ? 0 : value < min ? min : value > max ? max : value;

export const useSpawn = ({
    height,
    width,
}: {
    height: number;
    width: number;
}): SpawnState => {
    const [spawn, setSpawn] = useState<Spawn>({ x: 0, y: 0, rotation: 0 });
    const [choosing, setChoosing] = useState<boolean>(false);

    // set the spawn point in singleplayer
    const setPosition = (position: [number, number]) => {
        setChoosing(false);
        setSpawn((s) => ({
            ...s,
            x: clamp(position[0], 0, width),
            y: clamp(position[1], 0, height),
        }));
    };

    // set the spawn rotation in singleplayer
    const setRotation = (rotation: number) =>
        setSpawn((s) => ({ ...s, rotation: clamp(rotation, 0, 3) }));

    // set only x or y
    const setX = (x: number) =>
        setSpawn((s) => ({ ...s, x: clamp(x, 0, width) }));
    const setY = (y: number) =>
        setSpawn((s) => ({ ...s, y: clamp(y, 0, height) }));

    return {
        current: spawn,
        choosing,
        functions: { setX, setY, setChoosing, setPosition, setRotation },
    };
};
