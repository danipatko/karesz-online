import { Karesz } from './Karesz';
import { GameObject } from './Objects';
import { stringToPoint } from '../../lib/shared/util';
import React, { useEffect, useRef, useState } from 'react';
import { MapState } from '../../lib/hooks/singleplayer/map';
import useController from '../../lib/hooks/shared/controller';
import { SpawnState } from '../../lib/hooks/singleplayer/spawn';
import { ReplayState } from '../../lib/hooks/singleplayer/replay';

export const Replay = ({
    map,
    replay,
    onClick,
    visible,
    children,
}: {
    map: MapState;
    replay: ReplayState;
    onClick: (x: number, y: number) => void;
    visible: boolean;
    children?: React.ReactNode;
}) => {
    const controller = useController(replay);
    const container = useRef<HTMLDivElement>(null as any);
    const rightSide = useRef<HTMLDivElement>(null as any);
    const [tileSize, setTileSize] = useState<number>(16);
    const [size, setSize] = useState<[number, number]>([0, 0]);

    const calculateTileSize = () =>
        setTileSize(container.current.clientWidth / map.current.width);

    const resize = () => {
        const maxSize =
            Math.min(
                rightSide.current.clientWidth,
                rightSide.current.clientHeight
            ) - 100;
        if (map.current.width > map.current.height)
            setSize([
                maxSize,
                maxSize * (map.current.height / map.current.width),
            ]);
        else
            setSize([
                maxSize * (map.current.width / map.current.height),
                maxSize,
            ]);
    };

    const handleClick = (e: any) => {
        const rect = container.current.getBoundingClientRect();
        onClick(
            Math.floor((e.clientX - rect.left) / tileSize),
            Math.floor((e.clientY - rect.top) / tileSize)
        );
    };

    const adjust = () => {
        calculateTileSize();
        resize();
    };

    useEffect(() => {
        adjust();
        window.addEventListener('resize', adjust);
    }, [map.current, visible]);

    return (
        <div
            ref={rightSide}
            className='text-white flex-1 h-screen w-full overflow-hidden'
        >
            <button onClick={() => console.log(map.current)}>TEST</button>
            <style jsx>{`
                div > :global(.tilesize) {
                    width: ${tileSize}px !important;
                    height: ${tileSize}px !important;
                }
            `}</style>
            <div className='flex gap-5 p-2 items-center'>
                {!controller.isPlaying ? (
                    <button
                        onClick={controller.functions.play}
                        className='text-xl px-2 fa fa-play hover:text-[#0f0]'
                    ></button>
                ) : (
                    <button
                        onClick={controller.functions.stop}
                        className='text-xl px-2 fa fa-pause hover:text-karesz'
                    ></button>
                )}
                <button
                    onClick={controller.functions.reset}
                    className='text-xl px-2 fa fa-square hover:text-[#f00]'
                ></button>
                <div
                    style={{ color: controller.isPlaying ? '#0f0' : '#f00' }}
                    className='text-base font-semibold'
                >
                    {controller.isPlaying ? 'Playing' : 'Stopped'}
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
                        value={1}
                        onChange={(e) =>
                            controller.functions.setSpeed(
                                e.target.valueAsNumber
                            )
                        }
                    />
                    <div className='font-bold text-karesz-light'>
                        {controller.speed}ms
                    </div>
                </div>
            </div>
            <div
                id='map'
                ref={container}
                style={{
                    width: size[0] + 'px',
                    height: size[1] + 'px',
                    backgroundSize: true ? 'cover' : 'none',
                    backgroundImage: `url('/grids/grid-${map.current.width}x${map.current.height}.svg')`,
                }}
                onClick={handleClick}
                className='bg-slate-800 h-full w-full relative overflow-hidden'
            >
                {children}
                <Karesz state={controller.state.players} />
                {Array.from(map.current.objects).map(([pos, type], i) => {
                    const [x, y] = stringToPoint(pos);
                    return (
                        <GameObject
                            x={x}
                            y={y}
                            key={i}
                            type={type}
                            size={tileSize}
                        />
                    );
                })}
            </div>

            <div className='p-2'>
                <input
                    min={0}
                    max={replay.state[0].length - 1}
                    type='range'
                    value={controller.index}
                    onChange={(e) =>
                        controller.functions.stepTo(e.target.valueAsNumber)
                    }
                    className='slider'
                />
            </div>
        </div>
    );
};
