import { useRef } from 'react';

const PreJoin = ({
    modeCreate,
    onJoin,
    code,
    playerCount,
    cancel,
}: {
    modeCreate: boolean;
    onJoin: (name: string) => void;
    cancel: () => void;
    code: number;
    playerCount: number;
}) => {
    const nameField = useRef<HTMLInputElement>(null as any);

    const onChange = () => {
        let text = nameField.current.value;
        // filter text
        text = text.replace(/[^a-zA-Z\d\-\.\_]/gm, '').substring(0, 100);
        nameField.current.value = text;
    };

    const join = () => onJoin(nameField.current.value);

    return (
        <div className='flex justify-center items-center'>
            <div className='bg-main rounded-md p-10 text-center'>
                <h1 className='text-white font-semibold text-2xl mb-5'>
                    {modeCreate ? 'Creating new game' : `Join #${code}`}
                </h1>
                {modeCreate ? null : (
                    <div className='text-gray-400 mb-5'>
                        <span className='text-blue-500'>{playerCount}</span>
                        {playerCount == 1 ? ' player ' : ' players '}
                        in lobby
                    </div>
                )}
                <div className='mb-5'>
                    <input
                        onChange={onChange}
                        ref={nameField}
                        type='text'
                        placeholder='Display name'
                        className='p-2 text-white text-xl outline-none border-[3px] bg-main border-main-highlight rounded-md transition-colors focus:border-karesz'
                    />
                </div>
                <button
                    onClick={join}
                    className='px-5 py-2 rounded-lg transition-colors bg-karesz hover:bg-karesz-light text-lg font-semibold text-white'
                >
                    {modeCreate ? 'Create' : 'Join'}
                </button>
                <div
                    onClick={cancel}
                    className='mt-5 text-karesz font-bold hover:underline cursor-pointer'
                >
                    Back
                </div>
            </div>
        </div>
    );
};

export default PreJoin;
