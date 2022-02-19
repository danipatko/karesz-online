import type { NextPage } from 'next';
import { Monaco } from '@monaco-editor/react';
import { getCompletionItems } from '../lib/front/autocomplete';
import { useGame } from '../lib/front/game';
import JoinGame from '../components/JoinGame';
import Navbar from '../components/Navbar';

const Home: NextPage = () => {
    const [game, { join, fetchState }] = useGame();

    // join a game or create new if code is not present
    const joinGame = (name: string, code: number) => {
        join({ code, name });
    };

    const createNewGame = () => {
        console.log('sad');
    };

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
        <div className=''>
            <Navbar />
            <JoinGame onCreateNew={createNewGame} onJoin={joinGame} />
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
