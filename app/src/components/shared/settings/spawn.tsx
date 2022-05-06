import { SpawnState } from '../../../lib/hooks/singleplayer/spawn';
import { Number } from '../Util';

export const SpawnSettings = ({ spawn }: { spawn: SpawnState }) => {
    return (
        <div className='p-2'>
            <div className='font-bold text-lg'>Start state</div>
            <div className='flex gap-3 justify-start py-2 items-center'>
                <Number onChange={spawn.functions.setX} value={spawn.current.x}>
                    X
                </Number>
                <Number onChange={spawn.functions.setY} value={spawn.current.y}>
                    Y
                </Number>
                <Number
                    onChange={spawn.functions.setRotation}
                    value={spawn.current.rotation}
                >
                    R
                </Number>
                <div>
                    <button
                        onClick={() => spawn.functions.setChoosing((x) => !x)}
                        className='lightbutton'
                    >
                        {spawn.choosing ? 'click to place' : 'choose on map'}
                    </button>
                </div>
            </div>
        </div>
    );
};
