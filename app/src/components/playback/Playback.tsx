import { useEffect, useRef, useState } from 'react';
import { aliases } from '../../lib/front/aliases';
import useKaresz, { State } from '../../lib/hooks/karesz';

// TODO: textures
const Obj = ({
    size,
    type,
    position,
}: {
    size: number;
    type: number;
    position: string; // two numbers separated by '-'
}) => {
    return (
        <div
            className='absolute z-20'
            style={{
                borderRadius: type > 1 ? '100%' : '0',
                backgroundColor: [
                    '#fff',
                    '#8f1110',
                    '#000',
                    '#f00',
                    '#0f0',
                    '#ff0',
                ][type],
                width: size,
                height: size,
                transform: `translate(${
                    100 * parseInt(position.split('-')[0])
                }%,${100 * parseInt(position.split('-')[1])}%)`,
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
    view,
    onClick,
    showGrid,
    editorObjects,
    playbackObjects,
}: {
    size: 10 | 20 | 30 | 40;
    view: 'edit' | 'play';
    onClick: (x: number, y: number) => void;
    showGrid: boolean;
    editorObjects: { [key: string]: number };
    playbackObjects: { [key: string]: number };
}) => {
    const container = useRef<HTMLDivElement>(null as any);
    const [tileSize, setSize] = useState<number>(10);
    // current step
    const [index, setIndex] = useState<number>(0);
    // playback tick speed
    const [speed, setSpeed] = useState<number>(50);
    // the animator object
    const [karesz, { play, pause, reset, stepTo }] = useKaresz({
        // this data object is obtained from the rust api
        data: {
            players: [
                {
                    name: 'karex',
                    steps: [
                        0, 12, 0, 12, 0, 12, 0, 13, 2, 0, 13, 0, 13, 0, 13, 2,
                        0, 14, 0,
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
                        0, 12, 0, 12, 0, 12, 0, 13, 2, 0, 13, 0, 13, 0, 13, 2,
                        0, 14, 0,
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
        objects: playbackObjects,
        speed,
        setIndex,
    });
    // scale the container
    const adjust = () => {
        if (container.current) setSize(container.current.clientWidth / size);
    };

    useEffect(() => {
        console.log(playbackObjects);
        adjust();
        window.addEventListener('load', adjust);
        window.addEventListener('resize', adjust);
    }, []);

    // get x and y coordinates of the event
    const onClickHandler = (e: any) => {
        const rect = container.current.getBoundingClientRect();
        onClick(
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
                ref={container}
                style={{
                    backgroundImage: showGrid
                        ? `url('/grids/grid-${size}.svg')`
                        : 'none',
                    backgroundSize: showGrid ? 'cover' : 'none',
                }}
                onClick={onClickHandler}
                className='bg-slate-800 h-[75vh] w-[75vh]'
            >
                <PlayerInfo players={karesz.players} />

                {view == 'edit' ? (
                    <>
                        {Object.keys(editorObjects).map((pos, i) => {
                            return (
                                <Obj
                                    key={i}
                                    type={editorObjects[pos]}
                                    size={tileSize}
                                    position={pos}
                                />
                            );
                        })}
                    </>
                ) : (
                    <>
                        {Object.keys(karesz.objects ?? {}).map((pos, i) => (
                            <Obj
                                key={i}
                                size={tileSize}
                                type={karesz.objects[pos]}
                                position={pos}
                            />
                        ))}
                        {Object.values(karesz.players).map((karesz, i) => (
                            <Karesz
                                key={i}
                                size={tileSize}
                                state={karesz.state}
                            />
                        ))}
                    </>
                )}
            </div>

            <div className='p-2'>
                <input
                    min={0}
                    max={20 - 1}
                    type='range'
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
