import type { Game as GameType } from '../lib/front/game';
import ScoreBoard from './ScoreBoard';

const Game = ({ game }: { game: GameType }) => {
    return (
        <div className='bg-back h-screen w-full'>
            <div className='z-50 fixed font-semibold text-3xl text-white p-3'>
                Game #{game.code}
            </div>
            <ScoreBoard host={game.host} players={game.players} />
        </div>
    );
};

export default Game;
