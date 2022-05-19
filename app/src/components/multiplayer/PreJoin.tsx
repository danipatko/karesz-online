export const PreJoin = ({
    name,
    code,
    exit,
    submit,
    create,
    setName,
    playerCount,
}: {
    name: string;
    code: number;
    exit: () => void;
    create: boolean;
    submit: () => void;
    setName: (name: string) => void;
    playerCount: number;
}) => {
    return (
        <div className='flex justify-center items-center h-screen w-full'>
            <div className='bg-main rounded-md p-10 text-center'>
                <h1 className='text-white font-semibold text-2xl mb-5'>
                    {create ? 'Creating new game' : `Join #${code}`}
                </h1>
                {create ? null : (
                    <div className='text-gray-400 mb-5'>
                        <span className='text-blue-500'>{playerCount}</span>
                        {playerCount == 1 ? ' player ' : ' players '}
                        in lobby
                    </div>
                )}
                <div className='mb-5'>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='p-2 text-white text-xl outline-none border-[2px] bg-main border-zinc-500 rounded-md transition-colors focus:border-karesz'
                        placeholder='Display name'
                    />
                </div>
                <button
                    onClick={submit}
                    className='px-5 py-2 rounded-lg transition-colors bg-karesz hover:bg-karesz-light text-lg font-semibold text-white'
                >
                    {create ? 'Create' : 'Join'}
                </button>
                <div
                    onClick={exit}
                    className='mt-5 text-karesz font-bold hover:underline cursor-pointer'
                >
                    Back
                </div>
            </div>
        </div>
    );
};
