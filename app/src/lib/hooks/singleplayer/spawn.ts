import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { modulus } from '../../shared/util';
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
        rotateLeft: () => void;
        rotateRight: () => void;
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

    // clamp spawn position when map w/h is changes
    useEffect(() => {
        setSpawn((s) => ({
            ...s,
            x: clamp(s.x, 0, width - 1),
            y: clamp(s.y, 0, height - 1),
        }));
    }, [width, height]);

    // set the spawn point in singleplayer
    const setPosition = (position: [number, number]) => {
        setChoosing(false);
        setSpawn((s) => ({
            ...s,
            x: clamp(position[0], 0, width - 1),
            y: clamp(position[1], 0, height - 1),
        }));
    };

    // set the spawn rotation in singleplayer
    const setRotation = (rotation: number) =>
        setSpawn((s) => ({ ...s, rotation: clamp(rotation, 0, 3) }));

    // rotate right
    const rotateRight = () =>
        setSpawn((s) => ({ ...s, rotation: modulus(s.rotation + 1, 4) }));

    // rotate left
    const rotateLeft = () =>
        setSpawn((s) => ({ ...s, rotation: modulus(s.rotation - 1, 4) }));

    // set only x or y
    const setX = (x: number) =>
        setSpawn((s) => ({ ...s, x: clamp(x, 0, width - 1) }));
    const setY = (y: number) =>
        setSpawn((s) => ({ ...s, y: clamp(y, 0, height - 1) }));

    return {
        current: spawn,
        choosing,
        functions: {
            setX,
            setY,
            rotateLeft,
            rotateRight,
            setChoosing,
            setPosition,
            setRotation,
        },
    };
};
