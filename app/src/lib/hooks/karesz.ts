import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Player } from '../shared/types';
import { Scoreboard } from './game';
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

const modulo = (a: number, b: number) => ((a % b) + b) % b;

// calculate the next step of the player
const getPlayerState = (
    c: number,
    state: { x: number; y: number; rotation: number }
): State => {
    switch (c) {
        case 0:
            // forward
            return {
                ...forward(state.x, state.y, state.rotation),
                rotation: state.rotation,
                c,
            };
        case 1:
            // turn left
            return { ...state, c, rotation: modulo(state.rotation - 1, 4) };
        case 2:
            // turn right
            return { ...state, c, rotation: modulo(state.rotation + 1, 4) };
        default:
            return { ...state, c };
    }
};

// check if player has placed a rock
// check if player has placed a rock
const getObjectState = (
    c: number,
    previous: { [key: string]: number },
    position: {
        x: number;
        y: number;
    }
): { [key: string]: number } | undefined => {
    // pick up a rock
    if (c === 4) {
        delete previous[`${position.x}-${position.y}`];
        return previous;
    }
    // place a rock
    else if (c > 11)
        return { ...previous, [`${position.x}-${position.y}`]: c - 10 };
    // no change
    else return previous;
};

// get all the steps of the players and objects
const getAllSteps = (
    players: Player[],
    rounds: number,
    objects: { [key: string]: number }
): [{ steps: State[]; name: string }[], { [key: string]: number }[]] => {
    const playerStates: { steps: State[]; name: string }[] = players.map(
        (x) => {
            return { steps: [{ c: -1, ...x.start }], name: x.name };
        }
    );
    const objectStates: { [key: string]: number }[] = [objects];

    for (let i = 0; i < rounds; i++) {
        players.map((x, k) => {
            // push only if not dead
            const state = getPlayerState(x.steps[i], playerStates[k].steps[i]);
            if (state) playerStates[k].steps.push(state);

            objectStates[i + 1] = {
                ...getObjectState(
                    x.steps[i],
                    {
                        ...objectStates[i], // state from previous round
                        ...objectStates[i + 1], // state from previous player
                    },
                    playerStates[k].steps[i]
                ),
            };
        });
    }

    return [playerStates, objectStates];
};

// function responsible for the playback
const useKaresz = ({
    size,
    speed,
    objects,
    setIndex,
    scoreboard,
}: {
    size: number;
    speed: number;
    objects: { [key: string]: number }; // objects at start state
    setIndex: Dispatch<SetStateAction<number>>;
    scoreboard: Scoreboard | null;
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
    const [playerStates, setPlayerStates] = useState<Karesz[]>([]);
    // these are the calculated object states
    const [objectStates, setObjectStates] = useState<
        { [key: string]: number }[]
    >([]);
    // this is the state used for animation
    const [state, setState] = useState<{
        players: {
            name: string;
            state: State;
        }[];
        objects: { [key: string]: number };
        isPlaying: boolean;
        size: number;
    }>({
        size,
        objects: objects,
        players: scoreboard
            ? Object.values(scoreboard.players).map((x) => {
                  return { name: x.name, state: { c: -1, ...x.start } };
              })
            : [],
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
        if (!scoreboard) return;
        // calculate the steps
        // console.log('calculating steps ...');
        const [_players, _objects] = getAllSteps(
            Object.values(scoreboard.players).map((x) => {
                return {
                    name: x.name,
                    steps: x.steps,
                    start: x.start,
                };
            }),
            scoreboard.rounds,
            objects
        );

        setState((s) => {
            return {
                ...s,
                size,
            };
        });

        setPlayerStates(_players);
        setObjectStates(_objects);
    }, [scoreboard]);

    const stop = () => {
        clearInterval(timer);
        setState((s) => {
            return { ...s, isPlaying: false };
        });
    };

    // increment the index, stop if reached the end othervise update the state
    const round = () => {
        setIndex((i) => {
            if (scoreboard && i + 1 > scoreboard.rounds) return 0;

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
        step = clamp(step, 0, scoreboard ? scoreboard.rounds - 1 : 0);
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

    return [state, { play, pause: stop, reset, stepTo }];
};

export default useKaresz;
