import { Replay } from '../shared/Replay';
import { GameSettings } from '../shared/GameSettings';
import { SingleState } from '../../lib/hooks/singleplayer/game';

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
            <Replay map={game.map} replay={game.replay} spawn={game.spawn} />
        </div>
    );
};
