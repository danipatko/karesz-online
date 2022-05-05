import React, { useEffect, useRef, useState } from 'react';
import useController from '../../lib/hooks/shared/controller';
import { MapState } from '../../lib/hooks/singleplayer/map';
import { ReplayState } from '../../lib/hooks/singleplayer/replay';
import { SpawnState } from '../../lib/hooks/singleplayer/spawn';
import { stringToPoint } from '../../lib/shared/util';
import { GameObject } from './objects';

export const Replay = ({
    map,
    spawn,
    replay,
    children,
}: {
    map: MapState;
    spawn: SpawnState;
    replay: ReplayState;
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
        map.functions.setField([
            Math.floor((e.clientX - rect.left) / tileSize),
            Math.floor((e.clientY - rect.top) / tileSize),
        ]);
    };

    useEffect(() => {
        calculateTileSize();
        window.onresize = () => {
            calculateTileSize();
            resize();
        };
        window.addEventListener('onload', calculateTileSize);
    });

    return (
        <div
            ref={rightSide}
            className='text-white flex-1 h-screen w-full overflow-hidden'
        >
            <div className='flex gap-5 p-2 items-center'>
                <button className='text-xl px-2 fa fa-play hover:text-[#0f0]'></button>
                <button className='text-xl px-2 fa fa-pause hover:text-karesz'></button>
                <button className='text-xl px-2 fa fa-square hover:text-[#f00]'></button>
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
                    backgroundImage: `url('/grids/grid-${map.current.width}x${map.current.height}.svg')`,
                    backgroundSize: true ? 'cover' : 'none',
                }}
                onClick={handleClick}
                className='bg-slate-800 h-full w-full relative overflow-hidden'
            >
                {children}
                {Array.from(map.current.objects).map(([pos, type], index) => {
                    const [x, y] = stringToPoint(pos);
                    return (
                        <GameObject size={tileSize} x={x} y={y} type={type} />
                    );
                })}
            </div>

            <div className='p-2'>
                <input
                    min={0}
                    max={2000}
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
