import { Replay } from '../shared/Replay';
import { GameSettings } from '../shared/GameSettings';
import { SingleState } from '../../lib/hooks/singleplayer/game';
import { Karesz } from '../shared/karesz';

export const Playground = ({
    game,
    visible,
}: {
    game: SingleState;
    visible: boolean;
}) => {
    const handleClick = (x: number, y: number) => {
        if (game.spawn.choosing) game.spawn.functions.setPosition([x, y]);
        else if (game.map.editMode) game.map.functions.setField([x, y]);
    };

    return (
        <div
            style={{ display: visible ? 'flex' : 'none' }}
            className='flex w-full h-screen fadein'
        >
            <GameSettings run={game.run} map={game.map} spawn={game.spawn} />
            <Replay
                map={game.map}
                spawn={game.spawn}
                replay={game.replay}
                onClick={handleClick}
            >
                <Karesz
                    state={game.spawn.current}
                    className='opacity-50 z-20'
                />
            </Replay>
        </div>
    );
};
