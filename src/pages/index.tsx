import type { NextPage } from 'next';
import { Monaco } from '@monaco-editor/react';
import { getCompletionItems } from '../lib/front/autocomplete';
import ScoreBoard from '../components/ScoreBoard';
import Router from 'next/router';
import Edit from '../components/Edit';

const code = `
void FELADAT() {
    Console.WriteLine("hello world");
}
`;

const Home: NextPage = () => {
    return (
        <div className='bg-back h-screen w-full'>
            <div className='text-white'>{1111}</div>
            <div className='p-5'>
                <Edit />
            </div>
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
