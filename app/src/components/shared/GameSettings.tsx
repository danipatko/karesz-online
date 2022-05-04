import { useState } from 'react';
import { SingleState } from '../../lib/hooks/singleplayer/game';
import { MapState } from '../../lib/hooks/singleplayer/map';
import { SpawnState } from '../../lib/hooks/singleplayer/spawn';
import { InlineOption, NumberSlider, Option } from './Util';

export const GameSettings = ({
    map,
    spawn,
}: {
    map: MapState;
    spawn: SpawnState | null;
}) => {
    const [mapSize, setSize] = useState<string>('40');

    const set = (size: string) => {
        if (size == mapSize) return;
        setSize(size);
        switch (size) {
            case '20':
                map.functions.setSize(20, 20);
            case '30':
                map.functions.setSize(30, 30);
            case '40':
                map.functions.setSize(40, 40);
            default:
                map.functions.setSize(30, 40);
        }
    };

    return (
        <div className='p-4 h-full flex flex-col bg-lback abg-slate-800'>
            <div className='font-bold text-lg'>Game settings</div>
            <div className='py-2'>
                <div className='py-1'>
                    <span className='s-text'>Map size</span>
                    <InlineOption
                        select={set}
                        current={mapSize}
                        options={{
                            '20': <>20x20</>,
                            '30': <>30x30</>,
                            '40': <>40x40</>,
                            '34': <>40x30</>,
                        }}
                    />
                </div>
                <div className='py-1'>
                    <span className='s-text'>Load map</span>
                    <Option
                        current={map.current.mapName}
                        select={map.functions.loadMap}
                        options={{ 1: 'palya1', 2: 'palya2', 3: 'palya3' }}
                    />
                </div>
            </div>
        </div>
    );
};
