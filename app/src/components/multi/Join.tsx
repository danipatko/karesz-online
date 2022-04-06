import { useRef } from 'react';

const Join = ({
    onJoin,
    onCreate,
    onError,
}: {
    onJoin: (code: number) => void;
    onCreate: () => void;
    onError: (error: string) => void;
}) => {
    const codeField = useRef<HTMLInputElement>(null as any);

    const onChange = () => {
        let text = codeField.current.value;
        // replace everything but numbers and select first 4 letters
        text = text.replace(/[^\d]/gm, '').substring(0, 4);
        codeField.current.value = text;
    };

    const join = () => {
        let text = codeField.current.value;
        const code = parseInt(text);
        if (code > 9999 || code < 1000) {
            onError('Please enter a legit code');
            return;
        }
        onJoin(code);
    };

    return (
        <div className='flex justify-center items-center'>
            <div className='bg-main rounded-md p-10 text-center'>
                <h1 className='text-white font-semibold text-2xl mb-5'>
                    Join game
                </h1>
                <div>
                    <input
                        onChange={onChange}
                        ref={codeField}
                        type='text'
                        placeholder='Code'
                        className='p-2 text-white text-xl outline-none border-[3px] bg-main border-main-highlight rounded-md transition-colors focus:border-karesz'
                    />
                </div>
                <div className='my-5'>
                    <button
                        onClick={join}
                        className='px-5 py-2 rounded-lg transition-colors bg-karesz hover:bg-karesz-light text-lg font-semibold text-white'
                    >
                        Join
                    </button>
                </div>
                <div className='mb-5 flex justify-center'>
                    <div className='flex-1 h-[1px] my-3 bg-gray-400'></div>
                    <div className='text-base text-white px-2'>
                        or create new
                    </div>
                    <div className='flex-1 h-[1px] my-3 bg-gray-400'></div>
                </div>
                <button
                    onClick={onCreate}
                    className='px-5 py-2 rounded-lg transition-colors bg-karesz hover:bg-karesz-light text-lg font-semibold text-white'
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default Join;
