import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { getCompletionItems } from '../../lib/front/autocomplete';
import { codeState } from '../../lib/hooks/shared/code';
import { Number } from './Util';

export const CodeEditor = ({
    code,
    visible,
}: {
    code: codeState;
    visible: boolean;
}) => {
    // dynamically resize the editor (does not apply for height)
    const [width, setWidth] = useState<string>('100%');
    const [font, setFont] = useState<number>(14);
    const container = useRef<HTMLDivElement>(null as any);
    const resize = () => {
        const rect = container.current?.getBoundingClientRect();
        rect && setWidth(window.innerWidth - rect.left + 'px');
    };
    useEffect(() => {
        window.onresize = resize;
    });

    // load completion items here
    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.languages.registerCompletionItemProvider('csharp', {
            provideCompletionItems: () => {
                return {
                    suggestions: getCompletionItems(monaco),
                };
            },
        });
    };

    const onChange = (value: string | undefined) =>
        value && code.functions.setCode(value);

    return (
        <div
            style={{ display: visible ? 'flex' : 'none' }}
            className='flex w-full h-screen fadein'
        >
            <div className='p-4 h-full flex flex-col bg-lback abg-slate-800'>
                <div className='font-bold text-lg'>Code editor</div>
                <div>
                    <div className='items-center p-1'>
                        <i className='text-sm text-zinc-500 pr-2 fa fa-file'></i>{' '}
                        {'name.cs'}
                    </div>
                    <div className='items-center p-1'>
                        <i className='text-sm text-zinc-500 pr-2 fa fa-file'></i>{' '}
                        {'name2.cs'}
                    </div>
                    <div className='items-center p-1'>
                        <i className='text-sm text-zinc-500 pr-2 fa fa-file'></i>{' '}
                        {'name3.cs'}
                    </div>
                </div>
                <div className='flex-1'></div>
                <div className=''>
                    <Number
                        max={30}
                        min={9}
                        onChange={setFont}
                        defaultValue={font}
                    >
                        <i className='fa fa-text-height text-zinc-200'></i>
                    </Number>
                </div>
            </div>
            <div
                ref={container}
                className='overflow-hidden h-full flex-1 bg-back'
            >
                <Editor
                    width={width}
                    options={{
                        fontSize: font,
                        automaticLayout: true,
                        suggestSelection: 'first',
                    }}
                    value={code.code}
                    defaultLanguage='csharp'
                    defaultValue={code.code}
                    theme='vs-dark'
                    beforeMount={handleEditorWillMount}
                    onMount={() => {}}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};
