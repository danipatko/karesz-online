import { useEffect, useRef, useState } from 'react';

// TODO: textures
const Object = ({ size, x, y }: { size: number; x: number; y: number }) => {
    return (
        <div
            className='bg-red-400 absolute'
            style={{
                width: size,
                height: size,
                transform: `translate(${100 * x}%,${100 * y}%)`,
            }}
        ></div>
    );
};

const Karesz = ({
    size,
    x,
    y,
    rotation,
    name,
}: {
    size: number;
    x: number;
    y: number;
    rotation: number;
    name?: string;
}) => {
    return (
        <div
            className='absolute'
            style={{
                backgroundImage: 'url(/karesz/karesz0.png)',
                backgroundSize: 'contain',
                width: size,
                height: size,
                transform: `translate(${100 * x}%,${100 * y}%) rotate(${
                    (rotation % 4) * 90
                }deg)`,
            }}
        ></div>
    );
};

const Playback = ({
    size,
    showGrid,
}: {
    size: 10 | 20 | 30 | 40;
    showGrid: boolean;
}) => {
    const container = useRef<HTMLDivElement>(null as any);
    const [tileSize, setSize] = useState<number>(10);

    const adjust = () => {
        if (container.current) setSize(container.current.clientWidth / size);
    };

    useEffect(() => {
        window.addEventListener('resize', adjust);
        window.onload = adjust;
    });

    return (
        <div>
            <div
                ref={container}
                className='bg-white h-[80vw] w-[80vw]'
                style={{
                    backgroundImage: showGrid
                        ? `url('/grids/grid-${size}.svg')`
                        : 'none',
                    backgroundSize: showGrid ? 'cover' : 'none',
                }}
            >
                <Object size={tileSize} x={10} y={2} />
                <Object size={tileSize} x={11} y={2} />
                <Object size={tileSize} x={12} y={2} />
                <Object size={tileSize} x={13} y={2} />
                <Object size={tileSize} x={14} y={2} />
                <Karesz size={tileSize} x={1} y={2} rotation={1} />
            </div>
        </div>
    );
};

export default Playback;
