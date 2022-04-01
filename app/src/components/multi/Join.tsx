import { useRef } from 'react';

const Join = ({
    onJoin,
    onCreate,
}: {
    onJoin: (code: number) => void;
    onCreate: () => void;
}) => {
    const nameField = useRef<HTMLInputElement>(null as any);

    const join = () => {
        let text = nameField.current.value;
        // filter text
        text = text.trim().substring(0, 100).replace(/[^\d]/gm, '');
        console.log(text);
        const code = parseInt(text);
        // TODO: error message or onchange correction
        if (code > 9999 || code < 1000) return;
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
                        ref={nameField}
                        type='text'
                        placeholder='Code'
                        className='p-2 text-white text-xl outline-none border-2 bg-main border-main-highlight rounded-md transition-colors focus:border-fore'
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
