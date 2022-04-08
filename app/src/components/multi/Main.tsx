import { Game } from '../../lib/hooks/game';
import Playback from '../playback/Playback';
import Players from './Players';

const Main = ({ game }: { game: Game }) => {
    return (
        <div>
            <div className='flex items-center'>
                <div className='text-3xl font-bold p-5'>#{game.code}</div>
                <Players
                    players={[
                        { id: '', name: 'foo bar', ready: true, wins: 1 },
                        { id: '', name: 'dadwa', ready: false, wins: 1 },
                        { id: '', name: 'dasfbar', ready: true, wins: 0 },
                        ...Object.keys(game.players).map(
                            (x) => game.players[x]
                        ),
                    ]}
                    host={game.host}
                />
            </div>
            <div className='flex'>
                <div className='flex-1'>
                    <Playback onClick={() => {}} showGrid={true} size={20} />
                </div>
            </div>
            <div>{JSON.stringify(game)}</div>
        </div>
    );
};

export default Main;
