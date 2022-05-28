const objectColors = [
    'transparent',
    '#8f1110',
    '#000', // black
    '#f00', // red
    '#0f0', // green
    '#ff0', // yellow
    '#00f', // blue
    '#0ff', // cyan
    '#f0f', // magenta
];

export const GameObject = ({
    x,
    y,
    type,
    size,
}: {
    x: number;
    y: number;
    type: number;
    size: number;
}) => {
    return (
        <div
            style={{
                width: size + 'px',
                height: size + 'px',
                transform: `translate(${x * size}px,${y * size}px)`,
                backgroundColor: objectColors[type],
                borderRadius: type > 1 ? '100%' : '0',
            }}
            className='absolute'
        ></div>
    );
};
