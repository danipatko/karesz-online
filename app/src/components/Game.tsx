import type { Game as GameType } from '../lib/_hooks/game';

const Game = ({ game }: { game: GameType }) => {
    return (
        <div className='bg-back h-screen w-full'>
            <div className='text-white'>{game.code}</div>
            <div className='p-5'></div>
        </div>
    );
};

/* 
<ScoreBoard host={game.host} players={game.players} />
*/

export default Game;
