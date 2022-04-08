import { useEffect, useRef, useState } from 'react';
import { aliases } from '../../lib/front/aliases';
import useKaresz, { State } from '../../lib/hooks/karesz';

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
    state,
}: {
    size: number;
    state: { x: number; y: number; rotation: number };
}) => {
    return (
        <div
            className='absolute'
            style={{
                backgroundImage: 'url(/karesz/karesz0.png)',
                backgroundSize: 'contain',
                width: size,
                height: size,
                transform: `translate(${100 * state.x}%,${
                    100 * state.y
                }%) rotate(${(state.rotation % 4) * 90}deg)`,
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
    const [karesz, objects, { play, pause, reset }, { setBlock, stepTo }] =
        useKaresz({
            data: {
                players: [
                    {
                        name: 'karex',
                        steps: [
                            0, 3, 0, 3, 0, 3, 0, 3, 2, 0, 3, 0, 3, 0, 3, 2, 0,
                            3, 0,
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
        <div className='text-white m-5'>
            <div className='flex gap-5 p-2 items-center'>
                <button
                    className='text-xl px-2 fa fa-play hover:text-[#0f0]'
                    onClick={play}
                ></button>
                <button
                    className='text-xl px-2 fa fa-pause hover:text-karesz'
                    onClick={pause}
                ></button>
                <button
                    className='text-xl px-2 fa fa-square hover:text-[#f00]'
                    onClick={reset}
                ></button>
                <div
                    style={{ color: karesz.isPlaying ? '#0f0' : '#f00' }}
                    className='text-base font-semibold'
                >
                    {karesz.isPlaying ? 'Playing' : 'Stopped'}
                </div>
                <PlayerInfo players={karesz.players} />
            </div>
            <div
                onClick={onClickHandler}
                ref={container}
                className='bg-slate-800 h-[80vh] w-[80vh]'
                style={{
                    backgroundImage: showGrid
                        ? `url('/grids/grid-${size}.svg')`
                        : 'none',
                    backgroundSize: showGrid ? 'cover' : 'none',
                }}
            >
                {karesz.players.map((player, i) => (
                    <Karesz size={tileSize} key={i} state={player.state} />
                ))}

                <Object size={tileSize} x={10} y={2} />
                <Object size={tileSize} x={11} y={2} />
                <Object size={tileSize} x={12} y={2} />
                <Object size={tileSize} x={13} y={2} />
                <Object size={tileSize} x={14} y={2} />
            </div>

            <div className='p-2'>
                <input
                    type='range'
                    min={0}
                    max={20 - 1}
                    value={index}
                    onChange={(e) => stepTo(parseInt(e.target.value))}
                    className='slider'
                />
            </div>
        </div>
    );
};

const PlayerInfo = ({
    players,
}: {
    players: { name: string; state: State }[];
}) => {
    const [selected, select] = useState<number>(0);

    return (
        <div className='text-white p-3 flex border-separate border-gray-300 flex-1 justify-end'>
            <div className='border-r border-r-gray-600 px-4'>
                Tracking{' '}
                <span className='font-semibold'>
                    <select
                        onChange={(e) => select(parseInt(e.target.value))}
                        name='select-karesz'
                        className='outline-none border-none bg-transparent text-white'
                    >
                        {players.map((x, i) => (
                            <option
                                className='bg-slate-800 rounded-none'
                                key={i}
                                value={i}
                            >
                                {x.name}
                            </option>
                        ))}
                    </select>
                </span>
            </div>
            <div className='border-r border-r-gray-600 px-4 w-[140px] text-center'>
                Position{' '}
                <span className='text-karesz-light font-bold '>
                    {players[selected].state.x}:{players[selected].state.y}
                </span>
            </div>
            <div className='border-r border-r-gray-600 px-4 w-[160px] text-center'>
                Looking{' '}
                <span className='text-karesz-light font-bold'>
                    {
                        ['UP', 'RIGHT', 'DOWN', 'LEFT'][
                            players[selected].state.rotation
                        ]
                    }
                </span>
            </div>
            <div className='px-4 w-[200px] text-center'>
                {aliases[players[selected].state.c]}
            </div>
        </div>
    );
};

export default Playback;
