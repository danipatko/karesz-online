import e from 'express';
import { useEffect, useRef, useState } from 'react';
import { aliases } from '../../lib/front/aliases';
import useKaresz, { State } from '../../lib/hooks/karesz';

// TODO: textures
const Obj = ({
    size,
    position,
    type,
}: {
    type: number;
    size: number;
    position: number[];
}) => {
    return (
        <div
            className='absolute z-20'
            style={{
                borderRadius: type > 1 ? '100%' : '0',
                backgroundColor: [
                    'none',
                    '#8f1110',
                    '#000',
                    '#f00',
                    '#0f0',
                    '#ff0',
                ][type],
                width: size,
                height: size,
                transform: `translate(${100 * position[0]}%,${
                    100 * position[1]
                }%)`,
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
            className='absolute z-30'
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
    selected,
}: {
    size: 10 | 20 | 30 | 40;
    showGrid: boolean;
    selected: number;
    // onClick: (x: number, y: number) => number;
}) => {
    const container = useRef<HTMLDivElement>(null as any);
    const [tileSize, setSize] = useState<number>(10);
    const [index, setIndex] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(50);
    const [karesz, objects, { play, pause, reset }, { setBlock, stepTo }] =
        useKaresz({
            data: {
                players: [
                    {
                        name: 'karex',
                        steps: [
                            0, 12, 0, 12, 0, 12, 0, 13, 2, 0, 13, 0, 13, 0, 13,
                            2, 0, 14, 0,
                        ],
                        start: {
                            x: 5,
                            y: 5,
                            rotation: 0,
                        },
                    },
                    {
                        name: 'karex2',
                        steps: [
                            0, 12, 0, 12, 0, 12, 0, 13, 2, 0, 13, 0, 13, 0, 13,
                            2, 0, 14, 0,
                        ],
                        start: {
                            x: 7,
                            y: 6,
                            rotation: 0,
                        },
                    },
                ],
                rounds: 20,
            },
            speed,
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
        const rect = container.current.getBoundingClientRect();
        console.log(
            Math.floor((e.clientX - rect.left) / tileSize),
            Math.floor((e.clientY - rect.top) / tileSize)
        );
        setBlock(
            selected,
            Math.floor((e.clientX - rect.left) / tileSize),
            Math.floor((e.clientY - rect.top) / tileSize)
        );
    };

    return (
        <div className='text-white'>
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
                <div className='flex items-center gap-2'>
                    <div>Tick</div>
                    <input
                        type='range'
                        className='slider'
                        min={1}
                        max={2000}
                        step={1}
                        name='speed'
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <div className='font-bold text-karesz-light'>{speed}ms</div>
                </div>
            </div>
            <div
                onClick={onClickHandler}
                // onMouseMove={onClickHandler}
                ref={container}
                className='bg-slate-800 h-[75vh] w-[75vh]'
                style={{
                    backgroundImage: showGrid
                        ? `url('/grids/grid-${size}.svg')`
                        : 'none',
                    backgroundSize: showGrid ? 'cover' : 'none',
                }}
            >
                <PlayerInfo players={karesz.players} />

                {karesz.players.map((player, i) => (
                    <Karesz size={tileSize} key={i} state={player.state} />
                ))}

                {Object.keys(karesz.objects).map((pos, i) => {
                    return (
                        <Obj
                            type={karesz.objects[pos]}
                            key={i}
                            size={tileSize}
                            position={pos.split('-').map((x) => parseInt(x))}
                        />
                    );
                })}

                {Object.keys(objects).map((o, i) => {
                    return (
                        <Obj
                            type={objects[o]}
                            key={i}
                            size={tileSize}
                            position={o.split('-').map((x) => parseInt(x))}
                        />
                    );
                })}
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
    const [shown, show] = useState<boolean>(false);

    return !shown ? (
        <div
            onClick={(e) => {
                e.stopPropagation();
                show(true);
            }}
            className='absolute m-2 px-1.5 rounded-full inline-block bg-[rgba(0,0,0,50%)] text-white text-lg cursor-pointer z-30'
        >
            <i className='fa fa-gear'></i>
        </div>
    ) : (
        <div
            onClick={(e) => e.stopPropagation()}
            className='absolute flex m-2 text-white p-2 bg-[rgba(0,0,0,50%)] text-base w-[220px] z-30 rounded-md'
        >
            <div className='flex-1'>
                <div>
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
                <div>
                    Position{' '}
                    <span className='text-karesz-light font-bold '>
                        {players[selected].state.x}:{players[selected].state.y}
                    </span>
                </div>
                <div>
                    Looking{' '}
                    <span className='text-karesz-light font-bold'>
                        {
                            ['UP', 'RIGHT', 'DOWN', 'LEFT'][
                                players[selected].state.rotation
                            ]
                        }
                    </span>
                </div>
                <div className='font-bold text-karesz-light'>
                    {aliases[players[selected].state.c]}
                </div>
            </div>
            <div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        show(false);
                    }}
                    className='px-2 rounded-full text-white text-lg cursor-pointer'
                >
                    &#10005;
                </div>
            </div>
        </div>
    );
};

export default Playback;
