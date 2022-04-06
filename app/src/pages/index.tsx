import type { NextPage } from 'next';
// import { Monaco } from '@monaco-editor/react';
// import { getCompletionItems } from '../lib/front/autocomplete';
import { useState } from 'react';
import _Home from '../components/subpages/Home';
import Docs from '../components/subpages/Docs';
import Multiplayer from '../components/subpages/Multiplayer';
import Playground from '../components/subpages/Playground';
import Edit from '../components/subpages/Edit';
import { View } from '../lib/shared/types';
import Navbar from '../components/head/Navbar';
import { useGame } from '../lib/hooks/game';
import Errors from '../components/head/Error';

const code = `// Start your code here...
void FELADAT() {
    Lépj();
}
`;

const Home: NextPage = (props: any) => {
    const [view, setView] = useState<View>(View.Playground);
    const [content, setContent] = useState<string>(code);
    const [errors, setErrors] = useState<{ error: string; id: number }[]>([]);
    const err = (error: string) => {
        const id = Date.now();
        setErrors((e) => [...e, { error, id }]);
        setTimeout(
            () =>
                setErrors((e) => {
                    return [...e.filter((e) => e.id !== id)];
                }),
            4000
        );
    };
    const [game, functions] = useGame(0, err);

    return (
        <div className='bg-back h-screen'>
            <Navbar selected={view} select={setView} />
            {view === View.Home ? (
                <_Home />
            ) : view === View.Playground ? (
                <Playground />
            ) : view === View.Multiplayer ? (
                <Multiplayer onError={err} game={game} functions={functions} />
            ) : view === View.Docs ? (
                <Docs />
            ) : null}
            {/* NOTE: the switch can't be applied for monaco, because the contents get reset every time it is rendered */}
            <Edit
                shown={view === View.Edit}
                content={content}
                setContent={setContent}
            />
            <Errors
                errors={errors.map((x) => x.error)}
                onRemove={(i) =>
                    setErrors((e) => {
                        e.splice(i, 1);
                        return [...e];
                    })
                }
            />
        </div>
    );
};

export default Home;
