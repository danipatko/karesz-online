import Editor, { Monaco } from '@monaco-editor/react';
import { getCompletionItems } from '../lib/front/autocomplete';

const EditorSettings = () => {
    return (
        <div className='bg-[#1e1e1e] p-2 flex pb-5 rounded-t-md'>
            <div className='cursor-pointer px-2 py-1 rounded-sm bg-green-500 hover:bg-white text-black transition-colors text-sm'>
                Run <i className='fa fa-play'></i>
            </div>
        </div>
    );
};

const EditorOutput = () => {
    return (
        <div className='bg-[#1e1e1e] p-2 pt-5 rounded-b-md h-full'>
            <div className='overflow-y-scroll'>Hehehehha</div>
        </div>
    );
};

// layout concept: just like any editor - buttons and settings on top, editor in the middle, output below
const Edit = () => {
    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.languages.registerCompletionItemProvider('csharp', {
            provideCompletionItems: () => {
                return {
                    suggestions: getCompletionItems(monaco),
                };
            },
        });
    }; //*/

    return (
        <div className='flex flex-col justify-evenly'>
            <EditorSettings />
            <Editor
                height='80vh'
                defaultLanguage='csharp'
                defaultValue='// heheheha'
                theme='vs-dark'
                beforeMount={handleEditorWillMount}
            />
            <EditorOutput />
        </div>
    );
};

export default Edit;
