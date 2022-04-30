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

const SideButton = ({
    click,
    children,
}: {
    click: () => void;
    children?: ReactNode;
}) => {
    return (
        <div onClick={click} className='p-2'>
            {children}
        </div>
    );
};

const Number = ({
    onChange,
    defaultValue,
}: {
    onChange: (n: number) => void;
    defaultValue?: number;
}) => {
    const [value, setValue] = useState<number>(defaultValue ?? 0);

    const changed = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue((x) => {
            x = parseInt(e.target.value.replaceAll(/[^0-9\-\.]+/gm, ''));
            if (isNaN(x)) return 0;
            onChange(x);
            return x;
        });
    };

    const incr = () => setValue((x) => x + 1);
    const decr = () => setValue((x) => x - 1);

    return (
        <div className='flex justify-around items-center'>
            <div
                onClick={decr}
                className='font-bold select-none p-2 border-r-0 cursor-pointer border-transparent border-zinc-600 border-[1px] hover:bg-zinc-600 hover:text-karesz-light rounded-l-md'
            >
                &#8722;
            </div>
            <input
                type='text'
                value={value}
                onChange={changed}
                className='p-2 bg-transparent outline-none border-[1px] border-zinc-600 focus:border-karesz-light'
            />
            <div
                onClick={incr}
                className='font-bold select-none p-2 border-l-0 cursor-pointer border-transparent border-zinc-600 border-[1px] hover:bg-zinc-600 hover:text-karesz-light rounded-r-md'
            >
                &#43;
            </div>
        </div>
    );
};

export { TransparentButton, WhiteButton, DarkButton, Number };
