import { Game, Scoreboard } from '../../../lib/_hooks/game';
import { GameMap, GamePhase } from '../../../lib/shared/types';
import PreJoin from './PreJoin';
import Join from './Join';
import Main from './Main';

const Multiplayer = ({
    game,
    meta,
    onError,
    current,
    functions,
    scoreboard,
}: {
    game: Game;
    meta: { create: boolean; inLobby: number };
    onError: (error: string) => void;
    current: string;
    scoreboard: Scoreboard | null;
    functions: {
        exit: () => void;
        join: (name: string) => void;
        isHost: () => boolean;
        isReady: () => boolean;
        submit: (s: string) => void;
        create: (name: string) => void;
        preJoin: (code: number) => void;
        startGame: () => void;
        preCreate: () => void;
        updateMap: (map: GameMap) => void;
    };
}) => {
    return (
        <div className='text-white'>
            {game.state === GamePhase.disconnected ? (
                <Join
                    onJoin={functions.preJoin}
                    onError={onError}
                    onCreate={functions.preCreate}
                />
            ) : game.state === GamePhase.prejoin ? (
                <PreJoin
                    code={game.code}
                    cancel={functions.exit}
                    onJoin={functions.join}
                    modeCreate={meta.create}
                    playerCount={meta.inLobby}
                />
            ) : (
                <Main
                    game={game}
                    isHost={functions.isHost()}
                    onExit={functions.exit}
                    isReady={functions.isReady()}
                    onSubmit={functions.submit}
                    current={current}
                    updateMap={functions.updateMap}
                    scoreboard={scoreboard}
                />
            )}
        </div>
    );
};

export default Multiplayer;