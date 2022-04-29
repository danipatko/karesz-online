import type { NextPage } from 'next';
import { useSocket } from '../lib/hooks/shared/socket';
import { useSingleplayer } from '../lib/hooks/singleplayer/game';

const code = `// Start your code here...
void FELADAT() {
    while(true) {
        Console.WriteLine("lep");
        Lépj();
    }
}
`;

const Home: NextPage = () => {
    const socket = useSocket();
    const singlePlayer = useSingleplayer(socket as any);

    return (
        <div className='text-white h-[100vh] w-[100vw] flex'>
            <div className='h-[100vh] bg-slate-900 abg-[#2A416F] p-2 flex flex-col items-center gap-4'>
                <div className='rounded-2xl p-3'>
                    <i className='fa fa-house text-gray-300 font-bold text-lg'></i>
                </div>
                <div className='p-3'>
                    <i className='fa fa-code text-karesz-light font-bold text-lg'></i>
                </div>
                <div className='rounded-2xl p-3'>
                    <i className='fa fa-book text-gray-300 font-bold text-lg'></i>
                </div>
            </div>
            <div className='flex-1 flex'>
                <div className='bg-slate-800 abg-[#2A416F] w-52 shadow-left'></div>
                <div className='bg-back flex-1 shadow-left'>
                    <button className='' onClick={() => singlePlayer.run(code)}>
                        heheheha
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
