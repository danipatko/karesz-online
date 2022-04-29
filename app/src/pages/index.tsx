import type { NextPage } from 'next';
import { useState } from 'react';
import { useSocket } from '../lib/hooks/shared/socket';
import { useSingleplayer } from '../lib/hooks/singleplayer/game';

const code = `// Start your code here...
void FELADAT() {
    while(true) Lépj();
}
`;

const Home: NextPage = (props: any) => {
    const socket = useSocket();
    const singlePlayer = useSingleplayer(socket as any);

    return (
        <div className='text-white h-[100vh] w-[100vw]'>
            <button
                className=''
                onClick={() =>
                    singlePlayer.run('void FELADAT(){ while(true) Lépj(); }')
                }
            >
                heheheha
            </button>
        </div>
    );
};

export default Home;
