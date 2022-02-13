import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { getCompletionItems } from '../lib/front/autocomplete';

const Home: NextPage = () => {
    const [socket, setSocket] = useState<Socket>(null as any);

    useEffect(() => {
        const socket = io();

        socket.on(
            'fetch',
            ({
                players,
                host,
                code,
            }: {
                host: string;
                players: any;
                code: number;
            }) => {
                console.log(
                    `host: ${host} | code: ${code} \nPlayers: ${JSON.stringify(
                        players
                    )}`
                );
            }
        );

        socket.on('state_update', ({ state }: { state: number }) => {
            console.log(`new state: ${state}`);
        });

        socket.on(
            'joined',
            ({
                name,
                id,
                ready,
            }: {
                name: string;
                id: string;
                ready: boolean;
            }) => {
                console.log(`a new player joined: ${name}`);
            }
        );

        socket.on('left', ({ id }: { id: string }) => {
            console.log(`${id} left the game`);
        });

        socket.on(
            'player_update',
            ({ id, ready }: { id: string; ready: boolean }) => {
                console.log(`${id} is ${ready ? '' : 'not'} ready`);
            }
        );

        setSocket(socket);
    }, []);

    const join = () =>
        socket.emit('join', {
            name: 'bofa',
            code: parseInt(
                (document.getElementById('code') as HTMLInputElement).value
            ),
        });

    const monacoDidMount = (editor, monaco) => {
        console.log(editor);
        console.log(monaco);
    };

    function handleEditorWillMount(monaco: Monaco) {
        // here is the monaco instance
        // do something before editor is mounted
        monaco.languages.registerCompletionItemProvider('csharp', {
            provideCompletionItems: () => {
                return {
                    suggestions: getCompletionItems(monaco),
                };
            },
        });
    }

    return (
        <div className={styles.container}>
            <div>{socket?.connected ? 'connected' : 'not connected'}</div>
            <div>
                <input type='number' id='code' />
            </div>
            <button onClick={join}>join</button>
            <div>
                <Editor
                    height='90vh'
                    defaultLanguage='csharp'
                    defaultValue="console.log('hello world');"
                    theme='vs-dark'
                    onMount={monacoDidMount}
                    beforeMount={handleEditorWillMount}
                />
            </div>
        </div>
    );
};

export default Home;
