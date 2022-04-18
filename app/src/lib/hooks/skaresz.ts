// this is the same hook as useKaresz, except that it is for one single player
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export interface State {
    x: number;
    y: number;
    c: number;
    rotation: number;
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
    state: { x: number; y: number; rotation: number }
): State => {
    switch (c) {
        case 0:
            // forward
            return {
                c,
                rotation: state.rotation,
                ...forward(state.x, state.y, state.rotation),
            };
        case 1:
            // turn left
            return { c, ...state, rotation: (state.rotation - 1) % 4 };
        case 2:
            // turn right
            return { c, ...state, rotation: (state.rotation + 1) % 4 };
        default:
            return { c, ...state };
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
    state: {
        steps: number[];
        start: {
            x: number;
            y: number;
            rotation: number;
        };
    },
    objects: { [key: string]: number }
): [State[], { [key: string]: number }[]] => {
    const playerStates: State[] = [{ c: -1, ...state.start }];
    const objectStates: { [key: string]: number }[] = [objects];

    for (let i = 0; i < state.steps.length; i++) {
        playerStates.push(getPlayerState(state.steps[i], playerStates[i]));
        objectStates[i + 1] = {
            ...objectStates[i],
            ...getObjectState(state.steps[i], playerStates[i]),
        };
    }

    return [playerStates, objectStates];
};

const useSKaresz = ({
    size,
    roundResult,
    speed,
    objects,
    setIndex,
}: {
    size: number;
    speed: number;
    roundResult: {
        steps: number[];
        start: {
            x: number;
            y: number;
            rotation: number;
        };
    } | null;
    objects: { [key: string]: number };
    setIndex: Dispatch<SetStateAction<number>>;
}): [
    // animation state
    {
        size: number;
        players: { name: string; state: State }[];
        objects: { [key: string]: number };
        isPlaying: boolean;
    },
    // control functions
    {
        play: () => void;
        pause: () => void;
        reset: () => void;
        stepTo: (step: number) => void;
    }
] => {
    const [timer, setTimer] = useState<NodeJS.Timeout>(null as any);
    // these are the calculated player steps
    const [playerState, setPlayerState] = useState<State[]>([]);
    // these are the calculated object states
    const [objectState, setObjectState] = useState<{ [key: string]: number }[]>(
        []
    );
    // this is the state used for animation
    const [state, setState] = useState<{
        size: number;
        players: { name: string; state: State }[];
        objects: { [key: string]: number };
        isPlaying: boolean;
    }>({
        size,
        objects,
        players: [],
        isPlaying: false,
    });

    // get a specific step by index
    const getStep = (index: number): State => playerState[index];

    useEffect(() => {
        if (!roundResult) return;
        // calculate the steps
        console.log('calculating steps ...');
        const [_players, _objects] = getAllSteps(roundResult, objects);

        setState((s) => {
            return {
                ...s,
                size,
            };
        });

        setPlayerState(_players);
        setObjectState(_objects);
    }, [roundResult?.steps]);

    const stop = () => {
        clearInterval(timer);
        setState((s) => {
            return { ...s, isPlaying: false };
        });
    };

    // increment the index, stop if reached the end othervise update the state
    const round = () => {
        setIndex((i) => {
            if (roundResult && i + 1 > roundResult.steps.length) return 0;

            setState((s) => {
                return {
                    ...s,
                    objects: objectState[i],
                    players: [{ name: 'default', state: getStep(i) }],
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
            return {
                ...s,
                players: [{ name: 'default', state: getStep(0) }],
                objects: objectState[0],
            };
        });
    };

    // go to a step
    const stepTo = (step: number) => {
        step = clamp(step, 0, roundResult ? roundResult.steps.length - 1 : 0);
        if (state.isPlaying) stop();
        setIndex(step);
        setState((s) => {
            return {
                ...s,
                players: [{ name: 'default', state: getStep(step) }],
                objects: objectState[step],
            };
        });
    };

    return [state, { play, pause: stop, reset, stepTo }];
};

export default useSKaresz;
