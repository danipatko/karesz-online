import { useEffect, useRef, useState } from 'react';
import useKaresz from '../../lib/hooks/karesz';

// TODO: textures
const Object = ({ size, x, y }: { size: number; x: number; y: number }) => {
    return (
        <div
            className='bg-red-600 absolute'
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
    const [index, setIndex] = useState<number>(0);
    const [karesz, { play, pause, reset }] = useKaresz({
        data: {
            players: [
                {
                    name: 'karex',
                    steps: [
                        0, 3, 0, 3, 0, 3, 0, 3, 2, 0, 3, 0, 3, 0, 3, 2, 0, 3, 0,
                    ],
                    start: {
                        x: 5,
                        y: 5,
                        rotation: 0,
                    },
                },
            ],
            rounds: 20,
        },
        speed: 0.9,
        setIndex,
    });

    const adjust = () => {
        if (container.current) setSize(container.current.clientWidth / size);
    };

    useEffect(() => {
        adjust();
        window.addEventListener('load', adjust);
        window.addEventListener('resize', adjust);
    }, []);

    // get x and y coordinates of the event
    const onClickHandler = (e: any) => {
        const rect = e.target.getBoundingClientRect();
        onClick(
            Math.floor((e.clientX - rect.left) / tileSize),
            Math.floor((e.clientY - rect.top) / tileSize)
        );
    };

    return (
        <div className='text-white'>
            <div
                onClick={onClickHandler}
                ref={container}
                className='bg-slate-800 h-[80vw] w-[80vw] m-5'
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
                        rotation={player.state.rotation}
                        x={player.state.x}
                        y={player.state.y}
                        name={player.name}
                    />
                ))}

                <Object size={tileSize} x={10} y={2} />
                <Object size={tileSize} x={11} y={2} />
                <Object size={tileSize} x={12} y={2} />
                <Object size={tileSize} x={13} y={2} />
                <Object size={tileSize} x={14} y={2} />
            </div>
            <button className='px-2' onClick={play}>
                PLAY
            </button>
            <button className='px-2' onClick={pause}>
                PAUSE
            </button>
            <button className='px-2' onClick={reset}>
                RESET
            </button>
            <div>
                {karesz.isPlaying ? 'PLAYING' : 'STOPPED'} | {index}
            </div>
        </div>
    );
};

export default Playback;
