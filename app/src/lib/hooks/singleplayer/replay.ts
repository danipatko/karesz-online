import { useEffect, useState } from 'react';
import { SingleResult } from '../../shared/types';
import { pointToString, stringToPoint } from '../../shared/util';
import {
    getObjectStates,
    nextState,
    ObjectStates,
    Step,
} from '../shared/replay';

export type ReplayState = {
    walls: [number, number][];
    state: { steps: Step[]; objects: ObjectStates };
    loading: boolean;
};

// get player and object states from result object
const getSteps = (
    result: SingleResult,
    startingObjects: Map<string, number>
): { steps: Step[]; objects: ObjectStates } => {
    // set the 0th step
    const steps: Step[] = [{ step: -1, ...result.start }];
    // initialize the objects with the starting objects
    let objects: ObjectStates = new Map();
    for (const [position, value] of startingObjects.entries())
        objects.set(position, [[0, value]]);

    // get the states for the steps
    for (const [index, step] of result.steps.entries()) {
        steps.push(nextState(step, steps[steps.length - 1]));
        objects = getObjectStates(
            step,
            index,
            pointToString([
                steps[steps.length - 1].x,
                steps[steps.length - 1].y,
            ]),
            objects
        );
    }

    return { steps, objects };
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
    const [state, setState] = useState<{
        steps: Step[];
        objects: ObjectStates;
    }>({ steps: [], objects: new Map() });

    // called when result is updated
    useEffect(() => {
        if (!result) return;
        setLoading(true);

        const x = getSteps(result, new Map(objects));
        setState(x);
        console.log(x); // DEBUG

        setLoading(false);
    }, [result]);

    return { state, loading, walls };
};

export default useReplay;
