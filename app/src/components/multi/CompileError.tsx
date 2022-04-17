import { useEffect, useState } from 'react';

const CompileError = ({ logs }: { logs: string }) => {
    const [shown, setShown] = useState<boolean>(false);

    useEffect(() => {
        if (logs.length) setShown(true);
    }, [logs]);

    return shown ? (
        <div className='z-[60] text-white fixed flex justify-center items-center top-0 left-0 fadein w-[100vw] h-[100vh] bg-[rgba(0,0,0,75%)]'>
            <div className='p-4'>
                <div className='mb-4'>
                    <div className='font-bold text-lg'>
                        Please check your code for errors
                    </div>
                    <div className='text-gray-300'>
                        Compiler logs might be helpful
                    </div>
                </div>
                <code className='whitespace-pre'>
                    {decodeURIComponent(logs)}
                </code>
                <div
                    onClick={() => setShown(false)}
                    className='text-right mt-4'
                >
                    <button className='bg-karesz p-2 rounded-md hover:bg-karesz-light font-bold'>
                        Okay
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default CompileError;
