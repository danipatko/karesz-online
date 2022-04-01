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

const code = `
void FELADAT() {
    Console.WriteLine("hello world");
}
`;

const Home: NextPage = (props: any) => {
    const [view, setView] = useState<View>(View.Multiplayer);
    const [game, functions] = useGame(0);

    return (
        <div className='bg-back h-screen'>
            <Navbar selected={view} select={setView} />
            {view === View.Home ? (
                <_Home />
            ) : view === View.Edit ? (
                <Edit />
            ) : view === View.Playground ? (
                <Playground />
            ) : view === View.Multiplayer ? (
                <Multiplayer game={game} functions={functions} />
            ) : view === View.Docs ? (
                <Docs />
            ) : (
                <div>Uh oh - how'd you get here?</div>
            )}
        </div>
    );
};

export default Home;

/* 

<button onClick={fetchState}>Log state</button>
            <div>
                <input type='number' id='code' />
            </div>
            <div>
                <input type='text' placeholder='name' id='name' />
            </div>
            <button onClick={joinGame}>join</button>

            {game.connected ? (
                <div>
                    <div>
                        <div>Code: {game.code}</div>
                        <div>Host: {game.host}</div>
                        <div>Last winner: {game.lastWinner}</div>
                        <div>Phase: {game.state}</div>
                        <div>Player data: {JSON.stringify(game.players)}</div>
                    </div>
                    <div>
                        <ScoreBoard players={game.players} />
                    </div>
                </div>
            ) : (
                <div>Not yet joined</div>
            )}

<div>
                <Editor
                    height='90vh'
                    defaultLanguage='csharp'
                    defaultValue='// heheheha'
                    theme='vs-dark'
                    beforeMount={handleEditorWillMount}
                />
            </div>
*/
