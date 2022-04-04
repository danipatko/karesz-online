import { useEffect, useRef, useState } from 'react';
import useKaresz from '../../lib/hooks/karesz';

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
    onClick,
}: {
    size: 10 | 20 | 30 | 40;
    showGrid: boolean;
    onClick: (x: number, y: number) => void;
}) => {
    const container = useRef<HTMLDivElement>(null as any);
    const [tileSize, setSize] = useState<number>(10);
    const [karesz, index, { play, pause, reset }] = useKaresz({
        data: {
            players: [
                {
                    kills: 0,
                    name: 'karex',
                    rounds_survived: 0,
                    steps: [
                        0, 3, 0, 3, 0, 3, 0, 3, 2, 0, 3, 0, 3, 0, 3, 2, 0, 3, 0,
                        3,
                    ],
                },
            ],
            rounds: 10,
        },
        speed: 600,
    });

    const adjust = () => {
        if (container.current) setSize(container.current.clientWidth / size);
    };

    useEffect(() => {
        adjust();
        window.addEventListener('load', adjust);
        window.addEventListener('resize', adjust);
        play();
    }, [play]);

    // get x and y coordinates of the event
    const onClickHandler = (e: any) => {
        const rect = e.target.getBoundingClientRect();
        onClick(
            Math.floor((e.clientX - rect.left) / tileSize),
            Math.floor((e.clientY - rect.top) / tileSize)
        );
    };

    return (
        <div>
            <div
                onClick={onClickHandler}
                ref={container}
                className='bg-white h-[80vw] w-[80vw] m-5'
                style={{
                    backgroundImage: showGrid
                        ? `url('/grids/grid-${size}.svg')`
                        : 'none',
                    backgroundSize: showGrid ? 'cover' : 'none',
                }}
            >
                {karesz.players.map((player, i) => (
                    <Karesz
                        size={tileSize}
                        key={i}
                        rotation={player.steps[index].rotation}
                        x={player.steps[index].x}
                        y={player.steps[index].y}
                        name={player.name}
                    />
                ))}
                ;
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
