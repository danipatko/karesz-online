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
    value,
    children,
    onChange,
    className,
}: {
    min: number;
    max: number;
    value: number;
    children?: ReactNode;
    className?: string;
    onChange: (n: number) => void;
}) => {
    const changed = (e: React.ChangeEvent<HTMLInputElement>) => {
        const x = e.target.valueAsNumber;
        if (isNaN(x)) return 0;
        onChange(x);
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

const Option = ({
    select,
    current,
    options,
    children,
}: {
    select: (key: string) => void;
    current: string;
    options: { [key: string]: string };
    children?: ReactNode;
}) => {
    const [expanded, expand] = useState<boolean>(false);

    return (
        <div className='select-none w-full relative'>
            <div
                style={{
                    borderColor: expanded ? 'rgb(34,127,255)' : 'transparent',
                }}
                onClick={() => expand((x) => !x)}
                className='py-1 px-2 text-center items-center justify-end rounded-md flex gap-4 border-transparent border-[2px] bg-back font-semibold'
            >
                <div className='flex-1'>{options[current] ?? 'N/A'}</div>
                <div>
                    <i
                        className={`${
                            expanded ? 'r-down' : 'r-back'
                        } fa text-xs text-zinc-500 fa-chevron-right`}
                    ></i>
                </div>
            </div>
            <div className='overflow-hidden absolute w-full'>
                {expanded && (
                    <ul className='drop max-h-[50vh] overflow-scroll noscroll rounded-md shadow-sm'>
                        {Object.entries(options).map(([key, val], i) => (
                            <li
                                key={i}
                                className={`px-2 cursor-pointer py-[2px] bg-back text-center font-semibold hover:bg-zinc-700`}
                                onClick={() => {
                                    select(key);
                                    expand(false);
                                }}
                            >
                                {val}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const InlineOption = ({
    select,
    options,
    current,
}: {
    select: (key: string) => void;
    options: { [key: string]: ReactNode };
    current: string;
}) => {
    return (
        <div className='flex select-none font-semibold justify-between overflow-hidden rounded-md bg-back'>
            {Object.entries(options).map(([key, dom], i) => (
                <div
                    style={{
                        backgroundColor:
                            key == current ? 'rgb(34, 127, 255)' : '',
                    }}
                    onClick={() => select(key)}
                    className='p-2 flex-1 text-center'
                    key={i}
                >
                    {dom}
                </div>
            ))}
        </div>
    );
};

const Switch = ({
    value,
    onClick,
    option1,
    option2,
    disabled,
}: {
    value: boolean; // when option1 is true
    option1: ReactNode;
    option2: ReactNode;
    onClick: () => void;
    disabled?: boolean;
}) => {
    return (
        <div
            onClick={() => !disabled && onClick()}
            className='flex w-fit overflow-hidden relative bg-back rounded-md cursor-pointer select-none'
        >
            <div
                className={`${value ? 'option-l' : 'option-r'} ${
                    disabled ? 'opacity-50' : ''
                } absolute w-1/2 h-10 bg-karesz`}
            ></div>
            <div className='font-bold px-2 py-1 text-center flex-1 text-sm z-10'>
                {option1}
            </div>
            <div className='font-bold px-2 py-1 text-center flex-1 text-sm z-10'>
                {option2}
            </div>
        </div>
    );
};

const Number = ({
    min,
    max,
    value,
    children,
    onChange,
    className,
}: {
    min?: number;
    max?: number;
    value: number;
    children: ReactNode;
    onChange: (n: number) => void;
    className?: string;
}) => {
    const [focused, setFocus] = useState<boolean>(false);

    return (
        <div
            style={{
                borderColor: focused ? 'rgb(34,127,255)' : 'transparent',
            }}
            className={`${className} flex gap-4 bg-back p-2 border-[2px] rounded-md`}
        >
            <div className='text-zinc-500 font-bold'>{children}</div>
            <input
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                min={min ?? 0}
                max={max ?? 100}
                type='number'
                value={value}
                onChange={(e) => onChange(e.target.valueAsNumber)}
                className='outline-none w-[2.2rem] bg-transparent border-none'
            />
        </div>
    );
};

export {
    Switch,
    Option,
    Number,
    DarkButton,
    WhiteButton,
    NumberSlider,
    InlineOption,
    TransparentButton,
};
