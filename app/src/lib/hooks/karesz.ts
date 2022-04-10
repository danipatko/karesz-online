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

// calculate the next step of the player
const getPlayerState = (
    c: number,
    { x, y, rotation }: { x: number; y: number; rotation: number }
): State => {
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

// check if player has placed a rock
const getObjectState = (
    c: number,
    {
        x,
        y,
    }: {
        x: number;
        y: number;
    }
): { [key: string]: number } | undefined => {
    if (c > 11) return { [`${x}-${y}`]: c - 10 };
    return undefined;
};

// get all the steps of the players and objects
const getAllSteps = (
    players: Player[],
    rounds: number
): [{ steps: State[]; name: string }[], { [key: string]: number }[]] => {
    const playerStates: { steps: State[]; name: string }[] = players.map(
        (x) => {
            return { steps: [{ c: -1, ...x.start }], name: x.name };
        }
    );
    // TODO: set zeroth step to the original map of the game
    const objectStates: { [key: string]: number }[] = [{}];

    for (let i = 0; i < rounds; i++) {
        players.map((x, k) => {
            playerStates[k].steps.push(
                getPlayerState(x.steps[i], playerStates[k].steps[i])
            );
            objectStates[i + 1] = {
                ...(i > 0 && objectStates[i]), // add state from previous round
                ...objectStates[i + 1], // add state from previous player
                // add state from current player
                ...getObjectState(x.steps[i], {
                    ...playerStates[k].steps[i],
                }),
            };
        });
    }

    return [playerStates, objectStates];
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
    // animation state
    {
        players: { name: string; state: State }[];
        objects: { [key: string]: number };
        isPlaying: boolean;
    },
    // map state
    { [key: string]: number },
    // control functions
    { play: () => void; pause: () => void; reset: () => void },
    // map editor functions
    {
        stepTo: (step: number) => void;
        setBlock: (type: number, x: number, y: number) => void;
    }
] => {
    const [timer, setTimer] = useState<NodeJS.Timeout>(null as any);
    // these are the calculated player steps
    const [playerStates, setPlayerStates] = useState<Karesz[]>([]);
    // these are the calculated object states
    const [objectStates, setObjectStates] = useState<
        { [key: string]: number }[]
    >([]);
    // this is for the map editor
    const [objects, setObjects] = useState<{ [key: string]: number }>({});
    // this is the state used for animation
    const [state, setState] = useState<{
        players: {
            name: string;
            state: State;
        }[];
        objects: { [key: string]: number };
        isPlaying: boolean;
    }>({
        players: data.players.map((x) => {
            return { name: x.name, state: { c: -1, ...x.start } };
        }),
        objects: {}, // TODO: load the original map of the game
        isPlaying: false,
    });

    // get a specific step by index
    const getStep = (index: number) =>
        playerStates.map((p) => {
            return {
                name: p.name,
                state: p.steps[index],
            };
        });

    useEffect(() => {
        // calculate the steps
        const [players, objects] = getAllSteps(data.players, data.rounds);
        console.log(players, objects);
        setPlayerStates(players);
        setObjectStates(objects);
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
                    objects: objectStates[i],
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
            return { ...s, players: getStep(0), objects: objectStates[0] };
        });
    };

    // go to a step
    const stepTo = (step: number) => {
        step = clamp(step, 0, data.rounds - 1);
        if (state.isPlaying) stop();
        setIndex(step);
        setState((s) => {
            return {
                ...s,
                players: getStep(step),
                objects: objectStates[step],
            };
        });
    };

    // set the block at a specific position
    const setBlock = (type: number, x: number, y: number) => {
        console.log(`setting block at ${x}, ${y} to ${type}`);
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
