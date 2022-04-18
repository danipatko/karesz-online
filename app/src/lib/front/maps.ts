// TODO: import maps from original karesz
const maps: {
    [key: string]: {
        objects: { [key: string]: number };
        size: 10 | 20 | 30 | 40;
    };
} = {
    '0': {
        objects: {
            '0-0': 1,
        },
        size: 10,
    },
    '1': {
        objects: {
            '13-17': 1,
        },
        size: 40,
    },
    '2': {
        objects: {
            '10-1': 1,
        },
        size: 30,
    },
    '3': {
        objects: {
            '1-10': 1,
        },
        size: 10,
    },
    '4': {
        objects: {
            '4-4': 1,
        },
        size: 20,
    },
    '5': {
        objects: {
            '5-5': 1,
        },
        size: 10,
    },
};

export default maps;
