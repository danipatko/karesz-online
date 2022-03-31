import { useRef } from 'react';

const PreJoin = ({
    onJoin,
    code,
    playerCount,
}: {
    onJoin: (name: string) => void;
    code: number;
    playerCount: number;
}) => {
    const nameField = useRef<HTMLInputElement>(null as any);

    const join = () => {
        let text = nameField.current.value;
        // filter text
        text = text.trim().substring(0, 100).replace(/\s+/gm, '');
        console.log(text);

        onJoin(text);
    };

    return (
        <div className='bg-main rounded-md p-10 text-center'>
            <h1 className='text-white font-semibold text-2xl mb-5'>
                {code == 0 ? 'Create new game' : `Join #${code}`}
            </h1>
            <div className='text-gray-400 mb-5'>
                <span className='text-blue-500'>{playerCount}</span> player
                {playerCount == 1 ? ' ' : 's '}
                in lobby
            </div>
            <div className='mb-5'>
                <input
                    ref={nameField}
                    type='text'
                    placeholder='Display name'
                    className='p-2 text-white text-xl outline-none border-2 bg-main border-main-highlight rounded-md transition-colors focus:border-fore'
                />
            </div>
            <button
                onClick={join}
                className='px-5 py-2 rounded-lg transition-colors bg-fore hover:bg-fore-highlight text-lg font-semibold text-white'
            >
                {code == 0 ? 'Create' : 'Join'}
            </button>
        </div>
    );
};

export default PreJoin;
