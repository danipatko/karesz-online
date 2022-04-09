import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const MapEditor = ({
    selected,
    setSelected,
    clearAll,
}: {
    selected: number;
    setSelected: Dispatch<SetStateAction<number>>;
    clearAll: () => void;
}) => {
    return (
        <div className='p-2 bg-main rounded-md'>
            <div className='flex justify-between'>
                <div className='text-lg mb-4'>Edit map</div>
                <div>
                    <select className='outline-none border-none bg-main rounded-none'>
                        <option value='0'>palya1</option>
                        <option value='1'>palya2</option>
                        <option value='2'>palya3</option>
                        <option value='3'>palya4</option>
                    </select>
                </div>
            </div>
            <div
                onWheel={(e) => {
                    if (e.deltaY > 0)
                        setSelected((s) => (s + 1 > 5 ? 0 : s + 1));
                    else setSelected((s) => (s - 1 < 0 ? 5 : s - 1));
                }}
                className='flex border border-karesz justify-evenly text-center text-sm'
            >
                {['Empty', 'Wall', 'Black', 'Red', 'Green', 'Yellow'].map(
                    (x, i) => (
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
                    )
                )}
            </div>
        </div>
    );
};

export default MapEditor;
