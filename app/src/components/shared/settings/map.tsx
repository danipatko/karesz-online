import { useState } from 'react';
import { InlineOption, Option } from '../Util';
import { MapState } from '../../../lib/hooks/shared/map';

const ObjectTypes = [
    'empty',
    'wall',
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'cyan',
    'pink',
];

const Objects = ({
    select,
    current,
    onClear,
}: {
    select: (n: number) => void;
    current: number;
    onClear: () => void;
}) => {
    return (
        <div className='py-2'>
            <div>
                <span className='s-text'>Edit objects</span>{' '}
                <span className='text-xs text-zinc-400'>
                    (click on map to place)
                </span>
            </div>
            <div className='px-1 py-2 grid grid-cols-3 gap-2 items-center'>
                {ObjectTypes.map((item, i) => (
                    <div
                        onClick={() => select(i)}
                        style={{
                            borderColor:
                                current == i
                                    ? 'rgb(34,127,255)'
                                    : 'transparent',
                        }}
                        key={i}
                        className='bg-back text-center p-2 rounded-md border-[2px] items-center justify-center cursor-default select-none'
                    >
                        {item}
                    </div>
                ))}
            </div>
            <div className='py-2 text-center'>
                <button onClick={onClear} className='lightbutton p-2'>
                    clear all
                </button>
            </div>
        </div>
    );
};

export const MapSettings = ({ map }: { map: MapState }) => {
    const [mapSize, setSize] = useState<string>('2');

    const set = (size: string) => {
        if (size == mapSize) return;
        setSize(size);
        switch (size) {
            case '1':
                map.functions.setSize(10, 10);
                break;
            case '2':
                map.functions.setSize(20, 20);
                break;
            case '3':
                map.functions.setSize(30, 30);
                break;
            case '4':
                map.functions.setSize(40, 40);
                break;
            default:
                map.functions.setSize(40, 30);
                break;
        }
    };

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='font-bold text-lg'>Map settings</div>
            </div>
            <div className='relative'>
                <div className='py-2'>
                    <div className='py-1'>
                        <div className='s-text'>Map size</div>
                        <div className='py-2'>
                            <InlineOption
                                select={set}
                                current={mapSize}
                                options={{
                                    '1': <>10x10</>,
                                    '2': <>20x20</>,
                                    '3': <>30x30</>,
                                    '4': <>40x40</>,
                                    '5': <>40x30</>,
                                }}
                            />
                        </div>
                    </div>
                    <div className='py-1'>
                        <div className='s-text'>Load map</div>
                        <div className='py-2'>
                            <Option
                                current={map.current.mapName}
                                select={map.functions.loadMap}
                                options={{
                                    1: 'palya1',
                                    2: 'palya2',
                                    3: 'palya3',
                                }}
                            />
                        </div>
                    </div>
                    <Objects
                        select={map.functions.setCurrent}
                        current={map.selected}
                        onClear={map.functions.clearAll}
                    />
                </div>
            </div>
        </>
    );
};

export const MultiMapSettings = ({ map }: { map: MapState }) => {
    const [mapSize, setSize] = useState<string>('2');

    const set = (size: string) => {
        if (size == mapSize) return;
        setSize(size);
        switch (size) {
            case '1':
                map.functions.emitSize(10, 10);
                break;
            case '2':
                map.functions.emitSize(20, 20);
                break;
            case '3':
                map.functions.emitSize(30, 30);
                break;
            case '4':
                map.functions.emitSize(40, 40);
                break;
            default:
                map.functions.emitSize(40, 30);
                break;
        }
    };

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='font-bold text-lg'>Map settings</div>
            </div>
            <div className='relative'>
                <div className='py-2'>
                    <div className='py-1'>
                        <div className='s-text'>Map size</div>
                        <div className='py-2'>
                            <InlineOption
                                select={set}
                                current={mapSize}
                                options={{
                                    '1': <>10x10</>,
                                    '2': <>20x20</>,
                                    '3': <>30x30</>,
                                    '4': <>40x40</>,
                                    '5': <>40x30</>,
                                }}
                            />
                        </div>
                    </div>
                    <div className='py-1'>
                        <div className='s-text'>Load map</div>
                        <div className='py-2'>
                            <Option
                                current={map.current.mapName}
                                select={map.functions.emitLoadMap}
                                options={{
                                    1: 'palya1',
                                    2: 'palya2',
                                    3: 'palya3',
                                }}
                            />
                        </div>
                    </div>
                    <Objects
                        select={map.functions.setCurrent}
                        current={map.selected}
                        onClear={map.functions.emitClearAll}
                    />
                </div>
            </div>
        </>
    );
};
