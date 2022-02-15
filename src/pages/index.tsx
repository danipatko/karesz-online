import type { NextPage } from 'next';
import { Monaco } from '@monaco-editor/react';
import { getCompletionItems } from '../lib/front/autocomplete';
import { useGame } from '../lib/front/game';
import { SessionState } from '../lib/karesz/core/types';
import PlayerCard from '../components/PlayerCard';
import ScoreBoard from '../components/ScoreBoard';

export interface Game {
    connected: boolean;
    players: { [key: string]: { name: string; id: string; ready: boolean } };
    code: number;
    host: string;
    lastWinner: string;
    state: SessionState;
}

const Home: NextPage = () => {
    const [game, { join, fetchState }] = useGame();

    // join a game or create new if code is not present
    const joinGame = () => {
        join({
            code: parseInt(
                (document.getElementById('code') as HTMLInputElement).value
            ),
            name: (document.getElementById('name') as HTMLInputElement).value,
        });
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
        </div>
    );
};

export default Home;

/* 
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
