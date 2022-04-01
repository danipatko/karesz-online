import { Game } from '../../lib/hooks/game';
import { GameState } from '../../lib/shared/types';
import PreJoin from '../multi/PreJoin';
import Join from '../multi/Join';
import Main from '../multi/Main';

const Multiplayer = ({
    game,
    functions,
}: {
    game: Game;
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
            Multiplayer
            <div>{game.connected ? 'Connected' : 'Not connected'}</div>
            <div>
                {game.state === GameState.disconnected ? (
                    <Join
                        onJoin={functions.preJoin}
                        onCreate={functions.preCreate}
                    />
                ) : game.state === GameState.prejoin ? (
                    <PreJoin
                        modeCreate={game.modeCreate}
                        code={game.code}
                        onJoin={functions.join}
                        playerCount={game.playerCount}
                    />
                ) : game.state === GameState.notfound ? (
                    'Not found'
                ) : (
                    <Main game={game} />
                )}
            </div>
        </div>
    );
};

export default Multiplayer;
