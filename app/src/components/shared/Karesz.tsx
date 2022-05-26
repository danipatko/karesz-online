const COMMANDS = {
    0: 'Lépj',
    1: 'Fordulj balra',
    2: 'Fordulj balra',
    3: 'Van e előttem fal',
    4: 'Kilépek e a pályáról',
    20: 'Tegyél le egy kavicsot',
    7: 'Vegyél fel egy kavicsot',
    8: 'Mi van alattam',
    9: 'Van e itt kavics',
    6: 'Merre néz',
    10: 'Radar',
    11: 'Scan',
    12: 'Hol vagyok',
};

export const Karesz = ({
    data,
    state,
    tileSize,
    className,
}: {
    data?: {
        step: number;
        name: string;
    };
    state: {
        x: number;
        y: number;
        rotation: number;
    };
    tileSize?: number;
    className?: string;
}) => {
    return !state ? null : (
        <>
            {data && tileSize && (
                <div
                    style={{
                        transform: `translate(${tileSize * state.x}px,${
                            tileSize * state.y - tileSize
                        }px)`,
                    }}
                    className='p-2 text-xs absolute z-40 bg-black bg-opacity-60 rounded-tl-md rounded-br-md'
                >
                    <span className='font-bold text-white'>{data.name}</span> at{' '}
                    <span className='font-bold text-karesz'>
                        {state.x}:{state.y}
                    </span>
                </div>
            )}
            <div
                style={{
                    backgroundImage: `url(/karesz/karesz.png)`,
                    backgroundSize: 'cover',
                    transform: `translate(${100 * state.x}%,${
                        100 * state.y
                    }%) rotate(${(state.rotation % 4) * 90}deg)`,
                }}
                className={`${className} absolute tilesize z-30`}
            ></div>
        </>
    );
};
