import { Game } from '../../lib/hooks/game';
import Playback from '../playback/Playback';
import Players from './Players';

const Main = ({ game }: { game: Game }) => {
    return (
        <div>
            <div className='flex items-center mx-3'>
                <div className='text-3xl font-bold p-5'>#{game.code}</div>
                <Players
                    players={Object.keys(game.players).map(
                        (x) => game.players[x]
                    )}
                    host={game.host}
                />
            </div>
            <div className='flex m-5 gap-4'>
                <div className='flex-1'>
                    <Playback onClick={() => {}} showGrid={true} size={20} />
                </div>
                <div className='flex-1 flex flex-col gap-4'>
                    <div className='flex-1 bg-slate-800'></div>
                    <div className='flex-1 bg-slate-800'></div>
                    <div className='flex-1 bg-slate-800'></div>
                </div>
            </div>
        </div>
    );
};

export default Main;
