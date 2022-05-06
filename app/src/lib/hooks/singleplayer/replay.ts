import { useEffect, useState } from 'react';
import { SingleResult } from '../../shared/types';
import { stringToPoint } from '../../shared/util';
import {
    getObjectStates,
    nextState,
    ObjectStates,
    Step,
} from '../shared/replay';

export type ReplayState = {
    walls: [number, number][];
    state: [Step[], ObjectStates];
    loading: boolean;
};

// get player and object states from result object
const getSteps = (
    result: SingleResult,
    startingObjects: Map<string, number>
): [Step[], ObjectStates] => {
    const steps: Step[] = [{ step: -1, ...result.start }];
    let objects: ObjectStates = new Map();
    for (const [position, value] of startingObjects.entries())
        objects.set(stringToPoint(position), new Map([[[0, -1], value]]));

    for (const [index, step] of result.steps.entries()) {
        // step with the player
        steps.push(nextState(step, steps[steps.length - 1]));
        // adjust game objects
        objects = getObjectStates(
            step,
            index,
            [steps[steps.length - 1].x, steps[steps.length - 1].y],
            objects
        );
    }

    return [steps, objects];
};

export const useReplay = ({
    walls,
    result,
    objects,
}: {
    walls: [number, number][];
    result: SingleResult | null;
    objects: Map<string, number>;
}): ReplayState => {
    const [loading, setLoading] = useState<boolean>(false);
    const [state, setState] = useState<[Step[], ObjectStates]>([[], new Map()]);

    // called when result is updated
    useEffect(() => {
        console.log('CALLED');
        if (!result) return;
        setLoading(true);
        const x = getSteps(result, objects);
        setState(x);
        console.log(x);
        setLoading(false);
    }, [result]);

    return { state, loading, walls };
};

export default useReplay;
