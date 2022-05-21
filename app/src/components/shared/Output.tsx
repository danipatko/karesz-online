import { useEffect } from 'react';

export const Output = ({
    stdout,
    stderr,
    visible,
    setVisible,
}: {
    stdout: string;
    stderr: string;
    visible: boolean;
    setVisible: (v: boolean) => void;
}) => {
    useEffect(() => {
        if (stdout.length > 0 || stderr.length > 0) setVisible(true);
    }, [stdout, stderr]);

    return (
        <div
            style={{ display: visible ? 'flex' : 'none' }}
            className='fixed fadein justify-center bg-opacity-80 bg-black items-center z-50 top-0 left-0 h-screen w-screen'
        >
            <div className='p-4 w-full md:w-3/4 xl:w-1/2 border-l-[2px] border-l-karesz bg-back'>
                <div className='text-xl font-bold pb-4'>Output of last run</div>
                <div className='flex justify-center gap-4 max-w-[75vw] '>
                    <div className='flex-1'>
                        <div className='font-mono font-semibold pb-2'>
                            stdout:
                        </div>
                        <code>{stdout}</code>
                    </div>
                    <div className='flex-1'>
                        <div className='font-mono font-semibold pb-2'>
                            stderr:
                        </div>
                        <code>{stderr}</code>
                    </div>
                </div>
                <div className='text-right pt-4'>
                    <button
                        onClick={() => setVisible(false)}
                        className='bluebutton p-2'
                    >
                        ok
                    </button>
                </div>
            </div>
        </div>
    );
};
