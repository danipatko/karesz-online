import { Game, Scoreboard } from '../../lib/hooks/game';
import { GameMap, GameState } from '../../lib/shared/types';
import PreJoin from '../multi/PreJoin';
import Join from '../multi/Join';
import Main from '../multi/Main';

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
            {game.state === GameState.disconnected ? (
                <Join
                    onJoin={functions.preJoin}
                    onError={onError}
                    onCreate={functions.preCreate}
                />
            ) : game.state === GameState.prejoin ? (
                <PreJoin
                    code={game.code}
                    cancel={functions.exit}
                    onJoin={functions.join}
                    modeCreate={meta.create}
                    playerCount={meta.inLobby}
                />
            ) : (
                <Main
                    isHost={functions.isHost()}
                    game={game}
                    current={current}
                    updateMap={functions.updateMap}
                    scoreboard={scoreboard}
                />
            )}
        </div>
    );
};

export default Multiplayer;
