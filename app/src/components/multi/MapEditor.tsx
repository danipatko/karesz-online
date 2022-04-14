import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MapProps } from '../../lib/hooks/map';
import { GameMap } from '../../lib/shared/types';

const MapEditor = ({
    map,
    host,
    onSave,
    setType,
    setView,
    setSize,
    loadMap,
    onCancel,
    selected,
    clearAll,
    editor,
    setSelected,
}: {
    host: boolean;
    map: GameMap;
    onSave: () => void;
    loadMap: (name: string) => void;
    setType: (type: 'load' | 'parse') => void;
    setSize: (size: 10 | 20 | 30 | 40) => void;
    setView: (view: 'edit' | 'play') => void;
    onCancel: () => void;
    selected: number;
    clearAll: () => void;
    editor: MapProps;
    setSelected: Dispatch<SetStateAction<number>>;
}) => {
    return !host ? (
        <div className='p-2 bg-main rounded-md'>
            <div className='flex gap-4 justify-between'>
                <div>Map configuration</div>
                <div>
                    Size:{' '}
                    <span className='font-semibold text-karesz'>
                        {map.size}x{map.size}
                    </span>
                </div>
                <div>
                    Type:{' '}
                    <span className='font-semibold text-karesz'>
                        {map.type === 'parse' ? 'Custom' : map.load ?? 'Load'}
                    </span>
                </div>
            </div>
        </div>
    ) : (
        <div className='p-2 bg-main rounded-md relative'>
            {editor.view === 'play' ? (
                <div className='z-10 absolute top-0 left-0 w-full h-full rounded-md bg-[rgba(51,60,74,80%)] flex justify-center items-center'>
                    <button
                        onClick={() => setView('edit')}
                        className='p-2 select-none rounded-md font-bold text-white bg-karesz hover:bg-karesz-light'
                    >
                        Edit map
                    </button>
                </div>
            ) : null}

            <div>
                <div className='font-semibold'>Map configuration</div>
                <div className='flex item-center text-sm'>
                    <div
                        onClick={() => setType('parse')}
                        style={{
                            borderBottom:
                                editor.map.type == 'parse'
                                    ? '3px solid rgb(0, 94, 255)'
                                    : 'none',
                        }}
                        className='p-2 flex-1 text-center cursor-pointer select-none'
                    >
                        Custom
                    </div>
                    <div
                        onClick={() => setType('load')}
                        style={{
                            borderBottom:
                                editor.map.type == 'load'
                                    ? '3px solid rgb(0, 94, 255)'
                                    : 'none',
                        }}
                        className='p-2 flex-1 text-center cursor-pointer select-none'
                    >
                        Load existing
                    </div>
                </div>
                {editor.map.type === 'parse' ? (
                    <div className='p-2'>
                        <div className='py-2 flex gap-4 items-center justify-between'>
                            <div className='text-sm'>Map size</div>
                            <div className='flex-1'>
                                <input
                                    min={10}
                                    max={40}
                                    step={10}
                                    type='range'
                                    value={
                                        editor.view === 'play'
                                            ? map.size
                                            : editor.map.size
                                    }
                                    onChange={(e) =>
                                        setSize(
                                            parseInt(e.target.value) as
                                                | 10
                                                | 20
                                                | 30
                                                | 40
                                        )
                                    }
                                    className='slider'
                                />
                            </div>
                            <div className='text-karesz font-semibold'>
                                {editor.view === 'play'
                                    ? map.size
                                    : editor.map.size}
                                x
                                {editor.view === 'play'
                                    ? map.size
                                    : editor.map.size}
                            </div>
                        </div>
                        <div className='py-2'>
                            <div // select block
                                onWheel={(e) => {
                                    if (e.deltaY > 0)
                                        setSelected((s) =>
                                            s + 1 > 5 ? 0 : s + 1
                                        );
                                    else
                                        setSelected((s) =>
                                            s - 1 < 0 ? 5 : s - 1
                                        );
                                }}
                                className='flex border border-karesz justify-evenly text-center text-sm'
                            >
                                {[
                                    'Empty',
                                    'Wall',
                                    'Black',
                                    'Red',
                                    'Green',
                                    'Yellow',
                                ].map((x, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            backgroundColor:
                                                selected == i
                                                    ? 'rgb(0 94 255)'
                                                    : 'transparent',
                                        }}
                                        className='cursor-pointer select-none flex-1 p-2'
                                        onClick={() => setSelected(i)}
                                    >
                                        {x}
                                    </div>
                                ))}
                            </div>
                            <div className='text-sm text-zinc-500'>
                                Click on a field to place a block
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='p-2 flex justify-center items-center '>
                        <select
                            onChange={(e) => loadMap(e.target.value)}
                            className='bg-main font-semibold outline-none'
                        >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x, i) => (
                                <option
                                    key={i}
                                    value={x}
                                >{`palya-${x}.txt`}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className='flex justify-between p-2 items-center'>
                    <button
                        onClick={() => setView('play')}
                        className='font-semibold text-red-500 hover:underline outline-none'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setView('play');
                            onSave();
                        }}
                        className='p-2 select-none rounded-md font-bold text-white bg-green-500 hover:bg-green-400'
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapEditor;
