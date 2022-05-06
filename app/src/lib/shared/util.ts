// map keys should be primitive data types -> convert to string
export const stringToPoint = (str: string): [number, number] => {
    const split = str.split('_');
    return [parseInt(split[0]), parseInt(split[1])];
};

export const pointToString = (position: [number, number]): string =>
    `${position[0]}_${position[1]}`;

export const modulus = (a: number, b: number): number => ((a % b) + b) % b;
