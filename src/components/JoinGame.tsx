import { useRef } from 'react';

const clamp = (n: number, min: number, max: number) => {
    return n > max ? max : n < min ? min : n;
};

const JoinGame = ({
    onJoin,
    onCreateNew,
}: {
    onJoin: (name: string, code: number) => void;
    onCreateNew: (name: string) => void;
}) => {
    const codeInput = useRef<HTMLInputElement>(null as any);

    const checkCode = () => {
        const val = codeInput.current.value;
        if (val.length > 4) codeInput.current.value = val.substring(0, 4);
    };

    const join = () => {
        onJoin(
            (document.getElementById('name') as HTMLInputElement).value,
            parseInt(codeInput.current.value)
        );
    };

    const create = () => {
        onCreateNew(
            (document.getElementById('name') as HTMLInputElement).value
        );
    };

    return (
        <main className='flex flex-1 justify-center items-center asdh-screen bg-back text-white'>
            <div className='p-10 bg-main rounded-lg text-center'>
                <h1 className='font-semibold text-3xl mb-10'>
                    Join game or create new
                </h1>
                <div className='mb-5'>
                    <input
                        id='name'
                        type='text'
                        placeholder='display name'
                        className='p-2 text-xl outline-none border-2 bg-main border-main-highlight rounded-md transition-colors focus:border-fore'
                    />
                </div>
                <div className='mb-5'>
                    <input
                        ref={codeInput}
                        onChange={checkCode}
                        id='code'
                        type='number'
                        placeholder='game code'
                        className='p-2 text-xl outline-none border-2 bg-main border-main-highlight rounded-md transition-colors focus:border-fore'
                        min='1'
                        max='9999'
                    />
                </div>
                <button
                    onClick={join}
                    className='px-5 py-2 rounded-lg transition-colors bg-fore hover:bg-fore-highlight text-lg font-semibold'
                >
                    Join
                </button>
                <div className='p-2'></div>
                <button
                    onClick={create}
                    className='px-5 py-2 rounded-lg transition-colors bg-fore hover:bg-fore-highlight text-lg font-semibold'
                >
                    Create new
                </button>
            </div>
        </main>
    );
};

export default JoinGame;
