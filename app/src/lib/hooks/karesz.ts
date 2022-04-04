import { useEffect, useState } from 'react';
import { Player } from '../shared/types';
/*
 * STEPS
 * 0 - forward
 * 1 - turn left
 * 2 - turn right
 * 3 - kilépek a pályáról
 * 4 - pick up rock
 * 5 - place rock
 * 6 - merre néz
 * 7 - van e alattam kavics
 * 8 - mi van alattam
 * 9 - van e előttem fal
 */
interface State {
    x: number;
    y: number;
    rotation: number;
    c: number;
}

interface Karesz {
    name: string;
    steps: State[];
}

const forward = (
    x: number,
    y: number,
    rotation: number
): { x: number; y: number } => {
    if (rotation === 0) return { x, y: y + 1 };
    else if (rotation === 1) return { x: x + 1, y };
    else if (rotation === 2) return { x, y: y - 1 };
    else return { x: x - 1, y };
};

const getState = (c: number, x: number, y: number, rotation: number): State => {
    switch (c) {
        case 0:
            // forward
            return { c, rotation, ...forward(x, y, rotation) };
        case 1:
            // turn left
            return { c, x, y, rotation: (rotation - 1) % 4 };
        case 2:
            // turn right
            return { c, x, y, rotation: (rotation + 1) % 4 };
        default:
            return { c, rotation, x, y };
    }
};

// x y is the starting position, array is the steps
// TODO: obtaion starting position and rotation from the server
const getSteps = (x: number, y: number, arr: number[]): State[] => {
    let rot = 0;
    const res: State[] = [];
    arr.map((x) => {
        const s = getState(x, x, y, rot);
        res.push(s);
        rot = s.rotation;
        x = s.x;
        y = s.y;
    });
    return res;
};

// function responsible for the playback
const useKaresz = ({
    data,
    speed,
}: {
    data: { players: Player[]; rounds: number };
    speed: number;
}): [
    { players: Karesz[]; playing: boolean },
    { play: () => void; pause: () => void; reset: () => void }
] => {
    const [timer, setTimer] = useState<NodeJS.Timer>(null as any);
    const [index, setIndex] = useState<number>(0);
    const [state, setState] = useState<{ players: Karesz[]; playing: boolean }>(
        { players: [], playing: false }
    );

    useEffect(() => {
        // calculate the steps
        setState((s) => {
            for (const player of data.players) {
                s.players.push({
                    name: player.name,
                    steps: getSteps(0, 0, player.steps),
                });
            }
            return s;
        });
    });

    const stop = () => {
        clearInterval(timer);
        setState((s) => {
            return { ...s, playing: false };
        });
    };

    const round = () => {
        if (index >= data.rounds) stop();
        else setIndex((i) => i + 1);
    };

    const play = () => {
        setTimer(setInterval(round, speed));
        setState((s) => {
            return { ...s, playing: true };
        });
    };

    const reset = () => {
        stop();
        setIndex(0);
    };

    return [state, { play, pause: stop, reset }];
};

export default useKaresz;
