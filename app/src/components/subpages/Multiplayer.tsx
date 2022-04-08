import { Game } from '../../lib/hooks/game';
import { GameState } from '../../lib/shared/types';
import PreJoin from '../multi/PreJoin';
import Join from '../multi/Join';
import Main from '../multi/Main';

const Multiplayer = ({
    game,
    meta,
    functions,
    onError,
}: {
    onError: (error: string) => void;
    game: Game;
    meta: { create: boolean; inLobby: number };
    functions: {
        startGame: () => void;
        submit: (s: string) => void;
        preJoin: (code: number) => void;
        join: (name: string) => void;
        create: (name: string) => void;
        preCreate: () => void;
        exit: () => void;
    };
}) => {
    return (
        <div className='text-white'>
            {game.state === GameState.disconnected ? (
                <Join
                    onError={onError}
                    onJoin={functions.preJoin}
                    onCreate={functions.preCreate}
                />
            ) : game.state === GameState.prejoin ? (
                <PreJoin
                    cancel={functions.exit}
                    modeCreate={meta.create}
                    code={game.code}
                    onJoin={functions.join}
                    playerCount={meta.inLobby}
                />
            ) : (
                <Main game={game} />
            )}
        </div>
    );
};

export default Multiplayer;
