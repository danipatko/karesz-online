import type { NextPage } from 'next';
import React, { useState } from 'react';
import { Editor } from '../components/shared/Editor';
import { Nav } from '../components/shared/Nav';
import { useCode } from '../lib/hooks/shared/code';
import { useSocket } from '../lib/hooks/shared/socket';
import { useSingleplayer } from '../lib/hooks/singleplayer/game';
import { View } from '../lib/shared/types';

const Home: NextPage = () => {
    const socket = useSocket();
    const singlePlayer = useSingleplayer(socket as any);
    const [view, setView] = useState<View>(View.Edit);
    const code = useCode();

    return (
        <div className='text-white h-[100vh] w-[100vw] flex'>
            <Nav view={view} setView={setView} />
            <div className='flex-1'>
                <Editor code={code}></Editor>
            </div>
        </div>
    );
};

/*
<Nav view={view} setView={setView} />
            <div className='flex-1'>
                <Editor code='asdf' setCode={() => {}}></Editor>
            </div>
*/

export default Home;
