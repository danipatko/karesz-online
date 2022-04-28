export interface Step {
    x: number;
    y: number;
    step: number;
    rotation: number;
}

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

export interface ObjectState {
    field: number;
    from: number; // the index of the step where object has been placed
    to: number; // the index of the step where the object was removed
}

// K -> [from index, to index], V -> field value
export type ObjectsAtPosition = Map<[number, number], number>;
// K -> [x, y], V -> ^^^
export type ObjectStates = Map<[number, number], ObjectsAtPosition>;

// HANDLING OBJECTS
// idea: create a map of the object data for each position
// object data includes the time the object was placed and
// the time it was removed (as the map key) and the field
// value (as the map value)
export const getObjectStates = (
    step: number,
    index: number,
    position: [number, number], // position of the current player
    objectStates: ObjectStates // the object states
): ObjectStates => {
    // object is being removed
    if (step == 7) {
        const objectsHere = objectStates.get(position);
        // no object here !currently! -> return
        if (!objectsHere || objectsHere.size == 0) return objectStates;

        const lastObject = objectsHere.entries().next().value;
        // no object here !currently! -> return
        if (lastObject.key[1] != -1) return objectStates;

        // set end time of the last object
        objectsHere.set([lastObject.key[0], index], lastObject.value);
        objectsHere.delete(lastObject.key);
        // save
        objectStates.set(position, objectsHere);

        // object is being placed
    } else if (step > 20) {
        const objectsHere = objectStates.get(position);

        // create first object
        if (!objectsHere)
            return objectStates.set(
                position,
                new Map([[[index, -1], step - 18]])
            );

        // else add or overwrite
        const lastObject = objectsHere.entries().next().value;
        // no object here !currently!
        if (lastObject.key[1] != -1)
            return objectStates.set(
                position,
                objectsHere.set([index, -1], step - 18)
            );

        objectStates.set(
            position,
            objectsHere
                // overwrite last object
                .set([lastObject.key[0], index], lastObject.value)
                // add new
                .set([index, -1], step - 18)
        );
    }

    return objectStates;
};
