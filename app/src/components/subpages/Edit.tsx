import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { getCompletionItems } from '../../lib/front/autocomplete';
import useScripts from '../../lib/hooks/scripts';
import { Lines } from '../util';

const Edit = ({ shown }: { shown: boolean }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [fontSize, setFontSize] = useState<number>(20);
    const [width, setWidth] = useState<string>('200px');
    const [currentText, setText] = useState<string>(`// heheheha \n\n\n`);
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
        setText(value);
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
                <div
                    ref={sideBar}
                    className='bg-back-vs text-white min-w-[20vw] flex flex-col justify-between'
                >
                    <ScriptLoader
                        current={currentText}
                        setCurrent={(s) => setText(s)}
                    />
                    <div className='flex justify-center'>
                        <FontSize
                            size={fontSize}
                            decr={() => setFontSize((x) => x - 1)}
                            incr={() => setFontSize((x) => x + 1)}
                        />
                    </div>
                </div>
                <div className='flex-1'>
                    <Editor
                        width={width}
                        options={{
                            fontSize,
                            automaticLayout: true,
                            suggestSelection: 'first',
                        }}
                        value={currentText}
                        defaultLanguage='csharp'
                        defaultValue={currentText}
                        theme='vs-dark'
                        beforeMount={handleEditorWillMount}
                        onMount={() => {
                            setTimeout(() => resize(), 100); // bruh
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
        <div className='flex  gap-2 text-sm'>
            <div
                onClick={decr}
                className='hover:bg-[#3f3f3f] p-2 cursor-pointer'
            >
                <i className='fa fa-minus'></i>
            </div>
            <div className='p-2 flex-1 text-sm'>Font {size}px</div>
            <div
                onClick={incr}
                className='hover:bg-[#3f3f3f] p-2 cursor-pointer'
            >
                <i className='fa fa-plus'></i>
            </div>
        </div>
    );
};
/*

*/
const ScriptLoader = ({
    current,
    setCurrent,
}: {
    current: string; // the string shown in the editor (dynamic)
    setCurrent: (content: string) => void; // set the value of the editor
}) => {
    const [scripts, { list, remove, save }] = useScripts();
    const [selected, setSelected] = useState<string>('unsaved');
    const [unsaved, setUnsaved] = useState<string>('');

    // set selected script & save unsaved changes
    const load = (name: string) => {
        // save current
        if (selected === 'unsaved') setUnsaved(current);
        else save(selected, current);
        // load new
        if (name === 'unsaved') setCurrent(unsaved);
        else setCurrent(scripts[name]);
        setSelected(name);
    };

    const rm = (name: string) => {
        if (name === 'unsaved') return;
        setCurrent(unsaved);
        setSelected('unsaved');
        remove(name);
    };

    return (
        <div>
            <div className='py-1 px-2 font-semibold text-[#aaa] uppercase text-sm '>
                scripts
            </div>
            <div>
                <ScOption
                    name='unsaved'
                    onRemove={() => {}}
                    onSelect={load}
                    selected={selected == 'unsaved'}
                />
                <div className='py-1 px-2 font-semibold text-[#aaa] uppercase text-sm'>
                    saved
                </div>
                <div className='max-h-[60vh] overflow-y-scroll hidden-scrollbar'>
                    {list().map((name: string, i: number) => (
                        <ScOption
                            name={name}
                            key={i}
                            onRemove={rm}
                            onSelect={load}
                            selected={name == selected}
                        />
                    ))}
                </div>
            </div>

            <div className='flex justify-center mt-10'>
                <SaveAs onSubmit={(name) => save(name, current)} />
            </div>
        </div>
    );
};

const ScOption = ({
    name,
    onRemove,
    onSelect,
    selected,
}: {
    name: string;
    selected: boolean;
    onRemove: (name: string) => void;
    onSelect: (name: string) => void;
}) => {
    return (
        <div
            onClick={() => onSelect(name)}
            style={{ borderColor: selected ? '#666666' : 'transparent' }}
            className='py-1 px-5 border-2 text-sm hover:bg-[#3f3f3f] transition-colors flex justify-between'
        >
            <div>{name}</div>
            {selected ? (
                <div
                    className='cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(name);
                    }}
                >
                    <i className='fa fa-x'></i>
                </div>
            ) : null}
        </div>
    );
};

const SaveAs = ({ onSubmit }: { onSubmit: (name: string) => void }) => {
    const nameField = useRef<HTMLInputElement>(null as any);
    const submit = () => {
        const a = nameField.current.value.replaceAll(/[^A-Za-z\d\-\.]/gm, '');
        if (a.length) onSubmit(a);
        nameField.current.value = '';
    };

    return (
        <div className='p-2 flex gap-4'>
            <input
                ref={nameField}
                type='text'
                placeholder='Save current as...'
                className='p-2 outline-none border-b-2 border-b-[#666] text-white bg-back-vs transition-colors focus:border-karesz-light'
            />
            <button onClick={submit} className='text-white text-lg'>
                <i className='fa fa-floppy-disk'></i>
            </button>
        </div>
    );
};

export default Edit;
