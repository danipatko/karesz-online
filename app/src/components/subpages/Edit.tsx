import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { getCompletionItems } from '../../lib/front/autocomplete';

const Edit = ({ shown }: { shown: boolean }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [fontSize, setFontSize] = useState<number>(20);
    const [width, setWidth] = useState<string>('200px');
    const sideBar = useRef<HTMLDivElement>(null as any);

    const handleEditorWillMount = (monaco: Monaco) => {
        if (!loading) return;
        monaco.languages.registerCompletionItemProvider('csharp', {
            provideCompletionItems: () => {
                return {
                    suggestions: getCompletionItems(monaco),
                };
            },
        });
    }; //*/

    const onChange = (value: string | undefined, event: any) => {
        if (value === undefined) return;
        console.log(value);
    };

    const resize = () => {
        // calculate width (100% - sideBar width - padding)
        setWidth(window.innerWidth - sideBar.current.clientWidth - 16 + 'px');
    };

    useEffect(() => {
        // Wait for end of resize events
        let timeout: NodeJS.Timeout;
        window.onresize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                resize();
            }, 200);
        };
    });

    return (
        <div style={{ display: shown ? 'block' : 'none' }}>
            {loading ? (
                <div className='h-[80vh] flex justify-center items-center'>
                    <div className='text-white text-2xl animate-pulse'>
                        Monaco is loading...
                    </div>
                </div>
            ) : null}

            <div
                style={{ display: loading ? 'none' : 'flex' }}
                className='p-2 flex h-[90vh] overflow-y-hidden'
            >
                <div ref={sideBar} className='bg-back-vs p-3 text-white'>
                    <FontSize
                        size={fontSize}
                        decr={() => setFontSize((x) => x - 1)}
                        incr={() => setFontSize((x) => x + 1)}
                    />
                </div>
                <div className='flex-1'>
                    <Editor
                        width={width}
                        options={{
                            fontSize,
                            automaticLayout: true,
                            suggestSelection: 'first',
                        }}
                        defaultLanguage='csharp'
                        defaultValue={`// heheheha \n\n\n`}
                        theme='vs-dark'
                        beforeMount={handleEditorWillMount}
                        onMount={() => {
                            setTimeout(() => resize(), 100);
                            setLoading(false);
                        }}
                        onChange={onChange}
                    />
                </div>
            </div>
        </div>
    );
};
/*

*/
const FontSize = ({
    size,
    incr,
    decr,
}: {
    size: number;
    incr: () => void;
    decr: () => void;
}) => {
    return (
        <div className='flex border-2 border-gray-500 gap-2  text-sm'>
            <div
                onClick={decr}
                className='hover:bg-[#3f3f3f] p-2 cursor-pointer'
            >
                <i className='fa fa-minus'></i>
            </div>
            <div className='p-2 flex-1'>Font {size}px</div>
            <div
                onClick={incr}
                className='hover:bg-[#3f3f3f] p-2 cursor-pointer'
            >
                <i className='fa fa-plus'></i>
            </div>
        </div>
    );
};

export default Edit;
