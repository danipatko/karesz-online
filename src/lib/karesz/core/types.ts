export enum Rotation {
    up = 0,
    right = 1,
    down = 2,
    left = 3
}

export enum Field {
    null = -1,
    empty = 0,
    wall = 1,
    rock_black = 2,
    rock_red = 3,
    rock_green = 4,
    rock_yellow = 5
}

export const FIELD_VALUES = { 
    0: Field.empty,
    1: Field.wall,
    2: Field.rock_black,
    3: Field.rock_red,
    4: Field.rock_green,
    5: Field.rock_yellow
}

export type Karesz = {
    id:string;
    position:{ 
        x:number;
        y:number;
    };
    rotation:Rotation;
    steps:string;
}

export type KareszMap = {
    sizeX:number;
    sizeY:number;
    matrix:Array<Array<Field>>;
}

export type Point = {
    x:number;
    y:number;
}
