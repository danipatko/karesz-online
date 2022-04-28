import { useState } from 'react';
import { clamp, ObjectStates, Step } from './replay';

type SingleStates = [Step[], ObjectStates];
type MultiStates = [
    { [key: string]: { name: string; steps: Step[] } },
    ObjectStates
];

const useController = (
    states: SingleStates
): [
    { players: Step; objects: Map<[number, number], number> },
    boolean,
    number,
    {
        play: (speed: number) => void;
        stop: () => void;
        reset: () => void;
        stepTo: (index: number) => void;
    }
] => {
    const [timer, setTimer] = useState<NodeJS.Timeout>(null as any);
    const [index, setIndex] = useState<number>(0);
    const [isPlaying, setPlaying] = useState<boolean>(false);

    // filter out the objects that are not at the current step
    const getObjectsAtStep = (index: number): Map<[number, number], number> => {
        const result: Map<[number, number], number> = new Map();
        states[1].forEach((value) => {
            Array.from(value.entries()).forEach(([inter, field]) => {
                // the object is at the current step
                if (inter[0] >= index && inter[1] < index)
                    result.set(inter, field);
            });
        });
        return result;
    };

    // get a step of players
    const getStep = (index: number) => states[0][index];

    // state used for animation
    const [state, setState] = useState<{
        players: Step;
        objects: Map<[number, number], number>;
    }>({
        players: getStep(0),
        objects: getObjectsAtStep(0),
    });

    // increment the index, stop if reached the end othervise update the state
    const round = () => {
        setIndex((i) => {
            setState({
                objects: getObjectsAtStep(i + 1),
                players: getStep(i + 1),
            });
            return i + 1;
        });
    };

    // go to a step
    const stepTo = (step: number) => {
        if (isPlaying) stop();
        step = clamp(step, 0, states[0].length - 1);
        setIndex(step);

        setState({
            players: getStep(step),
            objects: getObjectsAtStep(step),
        });
    };

    // set an interval and set isPlaying
    const play = (speed: number) => {
        if (isPlaying) return;
        setPlaying(true);
        setTimer(setInterval(() => round(), clamp(speed, 1, 2000))); // default speed is 50ms
    };

    // clear the interval
    const stop = () => {
        clearInterval(timer);
        setPlaying(false);
    };

    // stops the game and resets players to the start position
    const reset = () => {
        stop();
        setIndex(0);
        setState({
            players: getStep(0),
            objects: getObjectsAtStep(0),
        });
    };

    return [state, isPlaying, index, { play, stop, reset, stepTo }];
};

export default useController;
