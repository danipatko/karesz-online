import { SingleState } from '../../lib/hooks/singleplayer/game';
import { GameSettings } from '../shared/GameSettings';

export const Playground = ({
    game,
    visible,
}: {
    game: SingleState;
    visible: boolean;
}) => {
    return (
        <div
            style={{ display: visible ? 'flex' : 'none' }}
            className='flex w-full h-screen fadein'
        >
            <GameSettings map={game.map} spawn={game.spawn} />
        </div>
    );
};
