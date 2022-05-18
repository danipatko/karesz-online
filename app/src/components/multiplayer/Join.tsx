// the screen where you enter the code or create new game
export const Join = ({
    code,
    join,
    create,
    setCode,
}: {
    code: number;
    join: () => void;
    create: () => void;
    setCode: (code: string) => void;
}) => {
    return (
        <div className='flex justify-center items-center h-screen w-full'>
            <div className='bg-main rounded-md p-10 text-center'>
                <h1 className='text-white font-semibold text-2xl mb-5'>
                    Join game
                </h1>
                <div>
                    <input
                        type='text'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className='p-2 text-white text-xl outline-none border-[2px] bg-main border-zinc-500 rounded-md transition-colors focus:border-karesz'
                        placeholder='Code'
                    />
                </div>
                <div className='my-5'>
                    <button onClick={join} className='bluebutton px-4 py-2'>
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
                <button onClick={create} className='bluebutton px-4 py-2'>
                    Create
                </button>
            </div>
        </div>
    );
};
