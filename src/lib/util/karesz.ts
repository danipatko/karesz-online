export interface instruction {
    command:string,
    value?:any
}

// coordinate defined by the x and y axis
export interface point {
    x: number,
    y: number
}
// some stats
export interface statistics {
    numSteps:number,
    numTurns:number,
    numWallchecks:number,
    numCrashes:number,
    numPickups:number,
    numColor:number,
    rocksCollected:number,
    rocksPlaced:number
}

// Basic turning directions
export enum directions {
    right = 1,
    left = -1
};
// rotation degrees
export enum rotations {
    up = 0,
    right = 1,
    down = 2,
    left = 3
}
// possible field values in matrix
export enum fields {
    null = -1,
    empty = 0,
    wall = 1,
    rock_black = 2,
    rock_red = 3,
    rock_green = 4,
    rock_yellow = 5
}

export const command_eqvivalents = {
    'r':'Set rotation ',
    'm':'Move to position ',
    'u':'Pick up rock from ',
    'd':'Place rock at ',
};

export const modulo = (a:number, b:number):number => a < 0 ? b + a%b : a%b;