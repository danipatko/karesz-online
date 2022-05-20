import type { NextPage } from 'next';
import React, { useState } from 'react';
import { View } from '../lib/shared/types';
import { Nav } from '../components/shared/Nav';
import Home from '../components/subpages/Home';
import { useCode } from '../lib/hooks/shared/code';
import { useSocket } from '../lib/hooks/shared/socket';
import { CodeEditor } from '../components/shared/Editor';
import { Multiplayer } from '../components/multiplayer/Multi';
import { useMultiplayer } from '../lib/hooks/multiplayer/game';
import { Playground } from '../components/playground/Playground';
import { useSingleplayer } from '../lib/hooks/singleplayer/game';

const Index: NextPage = () => {
    const code = useCode();
    const [socket, bind] = useSocket();
    const multiplayer = useMultiplayer(socket, bind, code.code);
    const singlePlayer = useSingleplayer(socket, code.code);
    const [view, setView] = useState<View>(View.Edit);

    return (
        <div className='text-white h-[100vh] w-[100vw] flex'>
            <Nav view={view} setView={setView} />
            <div className='flex-1'>
                {view === View.Home && <Home />}
                <CodeEditor visible={view === View.Edit} code={code} />
                <Playground
                    game={singlePlayer}
                    visible={view === View.Playground}
                />
                <Multiplayer
                    game={multiplayer}
                    visible={view === View.Multiplayer}
                />
            </div>
        </div>
    );
};

export default Index;
