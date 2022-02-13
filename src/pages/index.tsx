import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { getCompletionItems } from '../lib/front/autocomplete';
import { useGame } from '../lib/front/game';

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
    };

    return (
        <div className={styles.container}>
            <div>
                <button onClick={() => console.log(game)}>log 2</button>
            </div>
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
                    <div>Code: {game.code}</div>
                    <div>Host: {game.host}</div>
                    <div>Last winner: {game.lastWinner}</div>
                    <div>Phase: {game.state}</div>
                    <div>Player data: {JSON.stringify(game.players)}</div>
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
