import { Join } from './Join';
import { PreJoin } from './PreJoin';
import { Switch } from '../shared/Util';
import { Replay } from '../shared/Replay';
import { Scoreboard } from './Scoreboard';
import { GamePhase } from '../../lib/shared/types';
import { MultiMapSettings } from '../shared/settings/Map';
import { MultiplayerState } from '../../lib/hooks/multiplayer/game';

export const Multiplayer = ({
    game,
    visible,
}: {
    game: MultiplayerState;
    visible: boolean;
}) => {
    return (
        <div
            style={{ display: visible ? 'flex' : 'none' }}
            className='flex w-full h-screen fadein'
        >
            {game.session.phase === GamePhase.disconnected ? (
                <Join
                    code={game.code}
                    join={game.functions.info}
                    create={game.functions.preJoin}
                    setCode={game.functions.setCode}
                />
            ) : game.session.phase === GamePhase.prejoin ? (
                <PreJoin
                    code={game.code}
                    name={game.name}
                    exit={game.functions.leave}
                    create={game.creating}
                    submit={() =>
                        game.creating
                            ? game.functions.create()
                            : game.functions.join()
                    }
                    setName={game.functions.setName}
                    playerCount={game.playerCount}
                />
            ) : (
                <div className='p-4 h-full w-1/4  bg-lback abg-slate-800'>
                    <div>
                        <div className='mb-5 flex justify-between items-center'>
                            <div className='text-2xl font-bold'>
                                #{game.session.code}
                            </div>
                            <div>
                                <Switch
                                    value={game.map.editMode}
                                    option1='edit'
                                    option2='view'
                                    onClick={game.map.functions.switchView}
                                />
                            </div>
                        </div>
                        <div>{JSON.stringify(game.map)}</div>
                        <MultiMapSettings map={game.map} />
                    </div>
                    <div>{<Scoreboard game={game} />}</div>
                </div>
            )}
            <Replay
                map={game.map}
                replay={game.replay}
                visible={game.session.phase > 1}
                onClick={(x: number, y: number) =>
                    game.map.functions.emitField([x, y])
                }
            ></Replay>
        </div>
    );
};
