import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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
export interface State {
    x: number;
    y: number;
    rotation: number;
    c: number;
}

interface Karesz {
    name: string;
    steps: State[];
}

const clamp = (val: number, min: number, max: number) =>
    val > max ? max : val < min ? min : val;

const forward = (
    x: number,
    y: number,
    rotation: number
): { x: number; y: number } => {
    if (rotation === 0) return { x, y: y - 1 };
    else if (rotation === 1) return { x: x + 1, y };
    else if (rotation === 2) return { x, y: y + 1 };
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

const getSteps = (
    start: { x: number; y: number; rotation: number },
    arr: number[]
): State[] => {
    let state: State = { c: -1, ...start };
    const result: State[] = [state];
    arr.map((command) => {
        state = getState(command, state.x, state.y, state.rotation);
        result.push(state);
    });
    return result;
};

// function responsible for the playback
const useKaresz = ({
    data,
    speed,
    setIndex,
}: {
    data: { players: Player[]; rounds: number };
    speed: number;
    setIndex: Dispatch<SetStateAction<number>>;
}): [
    { players: { name: string; state: State }[]; isPlaying: boolean },
    { [key: string]: number },
    { play: () => void; pause: () => void; reset: () => void },
    {
        stepTo: (step: number) => void;
        setBlock: (type: number, x: number, y: number) => void;
    }
] => {
    const [timer, setTimer] = useState<NodeJS.Timeout>(null as any);
    const [players, setPlayers] = useState<Karesz[]>([]);
    // this is the object where the current values need to be rendered
    const [objects, setObjects] = useState<{ [key: string]: number }>({});
    const [state, setState] = useState<{
        players: {
            name: string;
            state: State;
        }[];
        isPlaying: boolean;
    }>({
        players: data.players.map((x) => {
            return { name: x.name, state: { c: -1, ...x.start } };
        }),
        isPlaying: false,
    });

    // get a specific step by index
    const getStep = (index: number) =>
        players.map((p) => {
            return {
                name: p.name,
                state: p.steps[index],
            };
        });

    useEffect(() => {
        // calculate the steps
        setPlayers((players) => {
            for (const player of data.players)
                players.push({
                    name: player.name,
                    steps: getSteps(player.start, player.steps),
                });

            return players;
        });
    }, []);

    const stop = () => {
        console.log('stopping...');
        clearInterval(timer);
        setState((s) => {
            return { ...s, isPlaying: false };
        });
    };

    // increment the index, stop if reached the end othervise update the state
    const round = () => {
        setIndex((i) => {
            if (i + 1 > data.rounds) return 0;

            setState((s) => {
                return {
                    ...s,
                    players: getStep(i),
                };
            });

            return i + 1;
        });
    };

    // set an interval and set isPlaying
    const play = () => {
        if (state.isPlaying) return;
        setState((s) => {
            return { ...s, isPlaying: true };
        });
        setTimer(setInterval(() => round(), clamp(speed, 1, 2000))); // default speed is 50ms
    };

    // stops the game and resets players to the start position
    const reset = () => {
        stop();
        setIndex(0);
        setState((s) => {
            return { ...s, players: getStep(0) };
        });
    };

    // go to a step
    const stepTo = (step: number) => {
        step = clamp(step, 0, data.rounds - 1);
        if (state.isPlaying) stop();
        setIndex(step);
        setState((s) => {
            return { ...s, players: getStep(step) };
        });
    };

    // set the block at a specific position
    const setBlock = (type: number, x: number, y: number) => {
        setObjects((o) => {
            if (type === 0) {
                delete o[`${x}-${y}`];
                return { ...o };
            }
            return {
                ...o,
                [`${x}-${y}`]: type,
            };
        });
    };

    return [state, objects, { play, pause: stop, reset }, { stepTo, setBlock }];
};

export default useKaresz;
