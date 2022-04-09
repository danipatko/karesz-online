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
    const [speed, setSpeed] = useState<number>(50);
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
        const rect = e.target.getBoundingClientRect();
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
                onClick={onClickHandler}
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
    const [shown, show] = useState<boolean>(false);

    return !shown ? (
        <div
            onClick={() => show(true)}
            className='absolute m-2 px-1.5 rounded-full inline-block bg-[rgba(0,0,0,50%)] text-white text-lg cursor-pointer'
        >
            <i className='fa fa-gear'></i>
        </div>
    ) : (
        <div className='absolute flex m-2 text-white p-2 bg-[rgba(0,0,0,50%)] text-base w-[220px] z-50'>
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
                    onClick={() => show(false)}
                    className='px-2 rounded-full text-white text-lg cursor-pointer'
                >
                    &#10005;
                </div>
            </div>
        </div>
    );
};

export default Playback;
