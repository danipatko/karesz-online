import { useEffect, useState } from 'react';
import { MultiResult } from '../../shared/types';
import { pointToString } from '../../shared/util';
import {
    Step,
    nextState,
    ObjectStates,
    getObjectStates,
} from '../shared/replay';

export type MultiReplayState = {
    rounds: number;
    walls: [number, number][];
    state: { players: { [key: string]: Step[] }; objects: ObjectStates };
    loading: boolean;
};

// get player and object states from result object
const getSteps = (
    result: MultiResult,
    startingObjects: Map<string, number>
): { players: { [key: string]: Step[] }; objects: ObjectStates } => {
    const players: { [key: string]: Step[] } = {};

    // set the 0th step
    for (const id in result.players)
        players[id] = [{ step: -1, ...result.players[id].started }];

    // initialize objects
    let objects: ObjectStates = new Map();
    for (const [position, value] of startingObjects.entries())
        objects.set(position, [[-1, value]]);

    // iter all steps
    for (let i = 0; i < result.rounds; i++) {
        for (const id in result.players) {
            // omit dead player
            if (result.players[id].steps.length <= i) continue;

            const step = nextState(result.players[id].steps[i], players[id][i]);
            players[id].push(step);
            objects = getObjectStates(
                result.players[id].steps[i],
                i,
                pointToString([step.x, step.y]),
                objects
            );
        }
    }

    // console.log(players[Object.keys(players)[0]]); // DEBUG

    return { players, objects };
};

export const useMultiReplay = ({
    walls,
    result,
    objects,
}: {
    walls: [number, number][];
    result: MultiResult | null;
    objects: Map<string, number>;
}): MultiReplayState => {
    const [loading, setLoading] = useState<boolean>(false);
    const [state, setState] = useState<{
        players: {
            [key: string]: Step[];
        };
        objects: ObjectStates;
    }>({ players: {}, objects: new Map() });

    // called when result is updated
    useEffect(() => {
        if (!result) return;
        setLoading(true);

        const x = getSteps(result, new Map(objects));
        setState(x);
        console.log(x); // DEBUG

        setLoading(false);
    }, [result]);

    return { state, loading, walls, rounds: result?.rounds ?? 0 };
};

export default useMultiReplay;
