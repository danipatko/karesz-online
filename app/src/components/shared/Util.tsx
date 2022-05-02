import { ReactNode, useState } from 'react';

const TransparentButton = ({ children }: { children?: ReactNode }) => {
    return (
        <button className='text-zinc-300 hover:text-karesz-light font-bold p-2 rounded-md bg-opacity-0 hover:bg-opacity-10 bg-zinc-500 transition-colors'>
            {children}
        </button>
    );
};

const WhiteButton = ({ children }: { children?: ReactNode }) => {
    return (
        <button className='text-karesz-light bg-white hover:text-white hover:bg-karesz-light font-bold p-2 rounded-md transition-colors'>
            {children}
        </button>
    );
};

const DarkButton = ({ children }: { children?: ReactNode }) => {
    return (
        <button className='text-zinc-300 bg-slate-800 hover:text-karesz-light hover:bg-slate-700 font-bold p-2 rounded-md transition-colors'>
            {children}
        </button>
    );
};

const NumberSlider = ({
    min,
    max,
    children,
    onChange,
    className,
    defaultValue,
}: {
    min: number;
    max: number;
    children?: ReactNode;
    className?: string;
    onChange: (n: number) => void;
    defaultValue?: number;
}) => {
    const [value, setValue] = useState<number>(defaultValue ?? 0);

    const changed = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue((x) => {
            x = e.target.valueAsNumber;
            if (isNaN(x)) return 0;
            onChange(x);
            return x;
        });
    };

    return (
        <div className='flex gap-4 justify-around items-center'>
            {children}
            <input
                min={min}
                max={max}
                type='range'
                value={value}
                onChange={changed}
                className={`range ${className}`}
            />
            <input
                type='number'
                min={min}
                max={max}
                value={value}
                onChange={changed}
                className='py-1 text-sm nput text-center font-semibold outline-none focus:border-karesz rounded-md bg-transparent border-[2px] border-zinc-500'
            />
        </div>
    );
};

export { TransparentButton, WhiteButton, DarkButton, NumberSlider as Number };
