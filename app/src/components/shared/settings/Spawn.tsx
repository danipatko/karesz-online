import { SpawnState } from '../../../lib/hooks/singleplayer/spawn';
import { Number } from '../Util';

export const SpawnSettings = ({ spawn }: { spawn: SpawnState }) => {
    return (
        <div className='p-2'>
            <div className='font-bold text-lg'>Start state</div>
            <div className='grid grid-cols-4 gap-3 justify-start py-2 items-center'>
                <Number onChange={spawn.functions.setX} value={spawn.current.x}>
                    X
                </Number>
                <Number onChange={spawn.functions.setY} value={spawn.current.y}>
                    Y
                </Number>
                <Number
                    className='col-span-2'
                    onChange={spawn.functions.setRotation}
                    value={spawn.current.rotation}
                >
                    R
                </Number>
                <div
                    onClick={() => spawn.functions.setChoosing((x) => !x)}
                    className='lightbutton p-2 col-span-2 text-center cursor-pointer'
                >
                    {spawn.choosing ? 'click to place' : 'choose on map'}
                </div>
                <div
                    onClick={spawn.functions.rotateLeft}
                    className='rounded-md text-center border-[2px] border-transparent cursor-pointer hover:border-karesz flex-1 p-2 bg-back'
                >
                    <i className='fa fa-rotate-left'></i>
                </div>
                <div
                    onClick={spawn.functions.rotateRight}
                    className='rounded-md text-center border-[2px] border-transparent cursor-pointer hover:border-karesz flex-1 p-2 bg-back'
                >
                    <i className='fa fa-rotate-right'></i>
                </div>
            </div>
        </div>
    );
};
