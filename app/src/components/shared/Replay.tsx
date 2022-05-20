import { Karesz } from './Karesz';
import { NumberSlider } from './Util';
import { GameObject } from './Objects';
import { MapState } from '../../lib/hooks/shared/map';
import { stringToPoint } from '../../lib/shared/util';
import React, { useEffect, useRef, useState } from 'react';
import useController from '../../lib/hooks/shared/controller';
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
            style={{ display: visible ? 'block' : 'none' }}
            className='text-white flex-1 h-screen w-full overflow-hidden'
        >
            <style jsx>{`
                div > :global(.tilesize) {
                    width: ${tileSize}px !important;
                    height: ${tileSize}px !important;
                }
            `}</style>
            <div className='flex gap-4 p-2 items-center relative'>
                {map.editMode && (
                    <div className='w-full absolute top-0 left-0 h-full opacity-80 bg-back z-20'></div>
                )}
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
                <NumberSlider
                    min={0}
                    max={2000}
                    value={controller.speed}
                    onChange={controller.functions.setSpeed}
                >
                    Tick<span className='text-sm text-zinc-600'>(ms)</span>
                </NumberSlider>
            </div>
            <div className='mx-5'>
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
                    {/* any object */}
                    {children}

                    {/* player */}
                    {!map.editMode && (
                        <Karesz state={controller.state.players} />
                    )}

                    {/* replay objects */}
                    {!map.editMode &&
                        controller.state.objects.map(([pos, type], i) => {
                            const [x, y] = stringToPoint(pos);
                            return (
                                <GameObject
                                    x={x}
                                    y={y}
                                    size={tileSize}
                                    type={type}
                                    key={i}
                                />
                            );
                        })}

                    {/* editor or static view objects */}
                    {map.editMode &&
                        Array.from(map.current.objects).map(
                            ([pos, type], i) => {
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
                            }
                        )}
                </div>
                <div>
                    <input
                        style={{
                            width: size[0] + 'px',
                        }}
                        min={0}
                        max={replay.state.steps.length - 1}
                        type='range'
                        value={controller.index}
                        disabled={map.editMode}
                        onChange={(e) =>
                            controller.functions.stepTo(e.target.valueAsNumber)
                        }
                        className='slider'
                    />
                </div>
            </div>
        </div>
    );
};
