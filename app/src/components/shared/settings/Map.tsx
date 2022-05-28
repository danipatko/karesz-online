import { useState } from 'react';
import { InlineOption, Option } from '../Util';
import { MapState } from '../../../lib/hooks/shared/map';

// ignore this shit
const maps = {
    palya0: 'palya0',
    palya1: 'palya1',
    palya2: 'palya2',
    palya3: 'palya3',
    palya4: 'palya4',
    palya5: 'palya5',
    palya6: 'palya6',
    palya7: 'palya7',
    palya8: 'palya8',
    palya9: 'palya9',
    palya10: 'palya10',
    palya11: 'palya11',
    palya12: 'palya12',
    palya13: 'palya13',
    palya14: 'palya14',
    palya15: 'palya15',
    palya16: 'palya16',
    palya17: 'palya17',
    palya18: 'palya18',
    palya19: 'palya19',
    palya20: 'palya20',
    palya21: 'palya21',
    palya22: 'palya22',
    palya23: 'palya23',
    palya24: 'palya24',
    palya25: 'palya25',
    palya26: 'palya26',
    palya27: 'palya27',
    palya28: 'palya28',
    palya29: 'palya29',
    palya30: 'palya30',
    palya31: 'palya31',
    palya32: 'palya32',
    palya33: 'palya33',
    palya34: 'palya34',
    palya35: 'palya35',
    palya36: 'palya36',
    palya37: 'palya37',
    palya38: 'palya38',
    palya39: 'palya39',
    palya40: 'palya40',
    palya41: 'palya41',
    palya42: 'palya42',
    palya43: 'palya43',
    palya44: 'palya44',
    palya45: 'palya45',
    palya46: 'palya46',
};

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
                map.functions.setSize(41, 31);
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
                                    '5': <>original</>,
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
                                options={maps}
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
                map.functions.emitSize(41, 31);
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
                                    '5': <>original</>,
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
