import { randomBytes } from 'crypto';

export const compareTo = (a: number, b: number): number => {
    return a > b ? 1 : b == a ? 0 : -1;
};

export const clamp = (val: number, min: number, max: number) => {
    return val > max ? max : val < min ? min : val;
};

export const randstr = (length: number): string => {
    return randomBytes(length / 2).toString('hex');
};

export const modulo = (a: number, b: number): number =>
    a < 0 ? b + (a % b) : a % b;

export const randCode = () => Math.floor(1000 + Math.random() * 9000);
