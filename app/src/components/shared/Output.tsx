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
            <div className='p-10 w-full lg:w-3/4'>
                <div className='text-xl font-bold pb-4'>Output of last run</div>
                <div className='overflow-scroll noscroll'>
                    <code className='p-3 whitespace-pre'>{stdout}</code>
                    <code className='p-3 whitespace-pre'>{stderr}</code>
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
