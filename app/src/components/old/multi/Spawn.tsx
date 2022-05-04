import { Dispatch, SetStateAction } from 'react';

const Spawn = ({
    start,
    setChoosing,
    setRotation,
    choosePosition,
}: {
    start: {
        x: number;
        y: number;
        rotation: number;
    };
    setChoosing: Dispatch<SetStateAction<boolean>>;
    setRotation: () => void;
    choosePosition: boolean;
}) => {
    return (
        <div className='p-4 rounded-md bg-main flex gap-8 justify-evenly items-center'>
            <div>
                Starting from{' '}
                <span className='text-karesz-light font-bold'>
                    {start.x}:{start.y}
                </span>
            </div>
            <div>
                <button
                    onClick={setRotation}
                    className='font-bold text-karesz-light'
                >
                    {['UP', 'RIGHT', 'DOWN', 'LEFT'][start.rotation]}{' '}
                </button>
            </div>
            <div>
                <button
                    onClick={() => setChoosing((s) => !s)}
                    className={`${
                        choosePosition
                            ? 'bg-red-600 hover:bg-red-500'
                            : 'bg-karesz hover:bg-karesz-light'
                    } p-2 text-white font-bold rounded-md `}
                >
                    {choosePosition ? 'Cancel' : 'Set starting point'}
                </button>
            </div>
        </div>
    );
};

export default Spawn;
