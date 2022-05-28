import { useState } from 'react';
import { Replay } from '../shared/Replay';
import { Karesz } from '../shared/Karesz';
import { Output } from '../shared/Output';
import { GameSettings } from '../shared/GameSettings';
import { SingleState } from '../../lib/hooks/singleplayer/game';

export const Playground = ({
    game,
    visible,
}: {
    game: SingleState;
    visible: boolean;
}) => {
    const [output, showOutput] = useState<boolean>(false);

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
                replay={game.replay}
                visible={visible}
                onClick={handleClick}
            >
                <Karesz
                    state={{ ...game.spawn.current, step: -1 }}
                    className={`${
                        game.map.editMode ? 'opacity-50' : 'hidden'
                    } z-20`}
                />
            </Replay>
            <Output setVisible={showOutput} visible={output} {...game.output} />
        </div>
    );
};
