import { useState } from 'react';
import { MapState } from '../../../lib/hooks/singleplayer/map';
import { InlineOption, Switch, Option } from '../Util';

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
                <button onClick={onClear} className='lightbutton'>
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
                <Switch
                    value={map.editMode}
                    option1='edit'
                    option2='view'
                    onClick={map.functions.switchView}
                />
            </div>
            <div className='relative'>
                {!map.editMode && (
                    <div className='w-full absolute h-full opacity-90 bg-lback rounded-md z-20'></div>
                )}
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
                {/* <div className='p-2 flex gap-4'>
                    <div
                        onClick={map.functions.cancel}
                        className='flex-1 text-center hover:bg-opacity-20 bg-zinc-300 bg-opacity-0 button text-red-600'
                    >
                        cancel
                    </div>
                    <div
                        onClick={map.functions.save}
                        className='flex-1 text-center hover:bg-green-500 button text-white bg-green-600'
                    >
                        save
                    </div>
                </div> */}
            </div>
        </>
    );
};
