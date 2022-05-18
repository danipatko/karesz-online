import { MultiplayerState } from '../../lib/hooks/multiplayer/game';
import { GamePhase } from '../../lib/shared/types';
import { Replay } from '../shared/Replay';
import { Join } from './Join';
import { PreJoin } from './PreJoin';

export const Multiplayer = ({
    state,
    visible,
}: {
    state: MultiplayerState;
    visible: boolean;
}) => {
    return (
        <div
            style={{ display: visible ? 'flex' : 'none' }}
            className='flex w-full h-screen fadein'
        >
            <div className='p-4 h-full w-1/4 flex flex-col justify-between bg-lback abg-slate-800'>
                {JSON.stringify(state)}
            </div>
            {state.session.phase === GamePhase.disconnected ? (
                <Join
                    code={state.code}
                    join={state.functions.info}
                    create={state.functions.promtName}
                    setCode={state.functions.setCode}
                />
            ) : state.session.phase === GamePhase.prejoin ? (
                <PreJoin
                    code={state.code}
                    name={state.name}
                    exit={state.functions.leave}
                    create={state.code < 1000}
                    submit={() =>
                        state.code < 1000
                            ? state.functions.create()
                            : state.functions.join()
                    }
                    setName={state.functions.setName}
                    playerCount={state.playerCount}
                />
            ) : null}

            <Replay
                map={state.map}
                replay={state.replay}
                visible={false}
                onClick={(data: any) => console.log(data)}
            ></Replay>
        </div>
    );
};
