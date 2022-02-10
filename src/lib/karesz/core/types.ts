export enum Rotation {
    up = 0,
    right = 1,
    down = 2,
    left = 3
}

export type State = {
    position:Point;
    rotation:Rotation;
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
    startState:State;
    id:string;
    position:Point;
    rotation:Rotation;
    steps:string;
}

export interface IKaresz extends Karesz {
    stepStates:State[];
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

/*
// typescript doesn't have a hexadecimal type :(

export enum Command {
    forward = 0x0,
    turn_left = 0x1,
    turn_right = 0x2,
    check_wall = 0x3,
    check_bounds = 0x4,
    check_direction = 0x5,
    check_field = 0x6,
    pick_up_rock = 0x7,
    radar = 0x8,
    check_under = 0x9,
    place_rock = 0xa,
    turn_direction = 0xb,
    looking_at = 0xc
}
*/

export enum Command {
    forward = '0',
    turn_left = '1',
    turn_right = '2',
    check_wall = '3',
    check_bounds = '4',
    check_direction = '5',
    check_field = '6',
    pick_up_rock = '7',
    radar = '8',
    check_under = '9',
    place_rock = 'a',
    turn_direction = 'b',
    looking_at = 'c'
}

export enum Rock {
    black = '#000',
    red = '#f00',
    yellow = '#0ff',
    green = '#0f0',
}

export const RockColor = {
    2: Rock.black,
    3: Rock.red,
    4: Rock.green,
    5: Rock.yellow,
}