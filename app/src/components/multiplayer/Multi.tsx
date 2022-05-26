import { Join } from './Join';
import { useState } from 'react';
import { PreJoin } from './PreJoin';
import { Switch } from '../shared/Util';
import { Output } from '../shared/Output';
import { Replay } from '../multiplayer/Replay';
import { Scoreboard } from './Scoreboard';
import { GamePhase } from '../../lib/shared/types';
import { MultiMapSettings } from '../shared/settings/Map';
import { MultiplayerState } from '../../lib/hooks/multiplayer/game';

const getWaiting = (phase: GamePhase, waiting: number) =>
    phase === GamePhase.running
        ? 'Running'
        : waiting < 1
        ? 'Waiting for players'
        : waiting > 1
        ? `Waiting for ${waiting} more players`
        : 'Waiting for 1 player';

export const Multiplayer = ({
    game,
    visible,
}: {
    game: MultiplayerState;
    visible: boolean;
}) => {
    const [output, showOutput] = useState<boolean>(false);

    return (
        <div
            style={{ display: visible ? 'flex' : 'none' }}
            className='flex w-full h-screen fadein'
        >
            <Output setVisible={showOutput} visible={output} {...game.output} />
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
                <div className='h-full w-1/4 flex flex-col bg-lback abg-slate-800'>
                    <div className='flex-1'>
                        <div>
                            <div
                                style={{
                                    backgroundColor:
                                        game.session.phase === GamePhase.running
                                            ? 'orange'
                                            : 'transparent',
                                }}
                                className='flex transition-colors justify-between m-2 rounded-md px-4 py-2'
                            >
                                <div>
                                    <div className='text-2xl font-bold'>
                                        In Game #{game.session.code}
                                    </div>
                                    <div className='text-zinc-300'>
                                        {getWaiting(
                                            game.session.phase,
                                            game.session.waiting
                                        )}
                                    </div>
                                </div>
                                <span>
                                    <Switch
                                        value={game.map.editMode}
                                        option1='edit'
                                        option2='view'
                                        onClick={game.map.functions.switchView}
                                    />
                                </span>
                            </div>
                            <div
                                style={{
                                    display:
                                        game.session.waiting > 0
                                            ? 'block'
                                            : 'none',
                                }}
                                className='relative overflow-hidden h-[2px]'
                            >
                                <div className='absolute bg-karesz w-40 h-[2px] loading'></div>
                            </div>
                        </div>
                        <div className='p-4'>
                            {!game.isHost || !game.map.editMode ? (
                                <div>{<Scoreboard game={game} />}</div>
                            ) : (
                                <MultiMapSettings map={game.map} />
                            )}
                        </div>
                    </div>
                    <div
                        onClick={() => showOutput(true)}
                        className='text-zinc-300 text-sm hover:underline hover:text-karesz cursor-pointer'
                    >
                        Show logs
                    </div>
                    <div className='p-4'>
                        <button
                            onClick={game.functions.ready}
                            className='w-full lightbutton p-2'
                        >
                            {game.session.isReady ? 'unready' : 'ready'}
                        </button>
                    </div>
                </div>
            )}
            <Replay
                map={game.map}
                replay={game.replay}
                players={game.session.players}
                visible={game.session.phase > 1}
                onClick={(x: number, y: number) =>
                    game.map.functions.emitField([x, y])
                }
            ></Replay>
        </div>
    );
};
