import { useState } from 'react';
import { stringToPoint } from '../../shared/util';
import { MultiReplayState } from '../multiplayer/replay';
import { clamp, ObjectStates, Step } from '../shared/replay';

export type ControllerState = {
    state: { players: { [key: string]: Step }; objects: [string, number][] };
    isPlaying: boolean;
    index: number;
    speed: number;
    functions: {
        play: () => void;
        stop: () => void;
        reset: () => void;
        stepTo: (index: number) => void;
        setSpeed: (speed: number) => void;
    };
};

const useController = (replay: MultiReplayState): ControllerState => {
    const [timer, setTimer] = useState<NodeJS.Timeout>(null as any);
    const [index, setIndex] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(50);
    const [isPlaying, setPlaying] = useState<boolean>(false);

    // filter out the objects that are not at the current step
    const getObjectsAtStep = (index: number): [string, number][] => {
        const result: [string, number][] = [];
        for (const [position, here] of replay.state.objects.entries()) {
            for (let i = 0; i < here.length; i++) {
                // here[i][0] is the step number
                if (
                    here[i][0] < index &&
                    (!here[i + 1]?.[0] || here[i + 1]?.[0] >= index)
                ) {
                    if (here[i][1] !== 0) result.push([position, here[i][1]]);
                    break;
                }
            }
        }
        return result;
    };

    // get a step of players
    const getStep = (index: number) => {
        const res: { [key: string]: Step } = {};
        for (const id in replay.state.players)
            res[id] = replay.state.players[id][index];
        return res;
    };

    // state used for animation
    const [state, setState] = useState<{
        players: { [key: string]: Step };
        objects: [string, number][];
    }>({
        players: getStep(0),
        objects: getObjectsAtStep(0),
    });

    // increment the index, stop if reached the end othervise update the state
    const round = () => {
        setIndex((i) => {
            if (i + 1 >= replay.rounds) i = 0;
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
        step = clamp(step, 0, replay.rounds - 1);
        setIndex(step);

        setState({
            players: getStep(step),
            objects: getObjectsAtStep(step),
        });
    };

    // set an interval and set isPlaying
    const play = () => {
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

    return {
        index,
        state,
        speed,
        isPlaying,
        functions: { setSpeed, play, stop, reset, stepTo },
    };
};

export default useController;
