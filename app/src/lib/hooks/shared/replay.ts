import { pointToString } from '../../shared/util';

export interface Step {
    x: number;
    y: number;
    step: number;
    rotation: number;
}

// [0] is the index of the step the object was placed
// [1] is the field
// e.g. [4] = 1 means object 1 was placed from step 4
export type ObjectsAtPosition = [number, number][];

export type ObjectStates = Map<string, ObjectsAtPosition>;

// make sure a value is between min and max
export const clamp = (val: number, min: number, max: number) =>
    val > max ? max : val < min ? min : val;

// get the position forward
export const forward = (
    x: number,
    y: number,
    rotation: number
): { x: number; y: number } => {
    if (rotation === 0) return { x, y: y - 1 };
    else if (rotation === 1) return { x: x + 1, y };
    else if (rotation === 2) return { x, y: y + 1 };
    else return { x: x - 1, y };
};

// set rotation with this
export const modulo = (a: number, b: number) => ((a % b) + b) % b;

// calculate the next step of the player
export const nextState = (
    step: number,
    state: { x: number; y: number; rotation: number }
): Step => {
    switch (step) {
        case 0:
            // forward
            return {
                ...forward(state.x, state.y, state.rotation),
                step,
                rotation: state.rotation,
            };
        case 1:
            // turn left
            return {
                ...state,
                step,
                rotation: modulo(state.rotation - 1, 4),
            };
        case 2:
            // turn right
            return {
                ...state,
                step,
                rotation: modulo(state.rotation + 1, 4),
            };
        default:
            return { ...state, step };
    }
};

export const getObjectStates = (
    step: number,
    index: number,
    position: string, // position of the current player
    objectStates: ObjectStates // the object states
): ObjectStates => {
    // object is being removed
    if (step == 7) {
        const objectsHere = objectStates.get(position);
        // no object here currently -> nothing to remove
        if (!objectsHere) return objectStates;
        // set field value to null
        objectsHere.push([index, 0]);
        objectStates.set(position, objectsHere);

        // object is being placed
    } else if (step > 20) {
        let objectsHere = objectStates.get(position);

        // create first object or add new
        if (!objectsHere) objectsHere = [];
        objectsHere.push([index, step - 20]);
        objectStates.set(position, objectsHere);
    }

    return objectStates;
};
