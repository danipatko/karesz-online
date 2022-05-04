import { NumberSlider } from './Util';
import { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { codeState } from '../../lib/hooks/shared/code';
import { getCompletionItems } from '../../lib/front/autocomplete';

export const CodeEditor = ({
    code,
    visible,
}: {
    code: codeState;
    visible: boolean;
}) => {
    // dynamically resize the editor (does not apply for height)
    const [width, setWidth] = useState<string>('100%');
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
                <div></div>
                <div className='flex-1'></div>
                <div className=''>
                    <NumberSlider
                        max={30}
                        min={9}
                        value={code.fontSize}
                        onChange={code.functions.setFontSize}
                    >
                        <i className='fa fa-text-height text-zinc-200'></i>
                    </NumberSlider>
                </div>
            </div>
            <div
                ref={container}
                className='overflow-hidden h-full flex-1 bg-back'
            >
                <Editor
                    width={width}
                    options={{
                        fontSize: code.fontSize,
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
