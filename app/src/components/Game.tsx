import type { Game as GameType } from '../lib/front/game';
import ScoreBoard from './ScoreBoard';
import Edit from './Edit';

const Game = ({ game }: { game: GameType }) => {
    return (
        <div className='bg-back h-screen w-full'>
            <div className='text-white'>{game.code}</div>
            <div className='p-5'>
                <Edit />
            </div>
        </div>
    );
};

/* 
<ScoreBoard host={game.host} players={game.players} />
*/

export default Game;
