import { Game, ScoreBoard } from '../../lib/hooks/game';
import { GameState } from '../../lib/shared/types';
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
    scoreboard: ScoreBoard | null;
    functions: {
        exit: () => void;
        join: (name: string) => void;
        submit: (s: string) => void;
        create: (name: string) => void;
        preJoin: (code: number) => void;
        startGame: () => void;
        preCreate: () => void;
        uploadMap: (config: {
            map: { [key: string]: number };
            size: number;
        }) => void;
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
                <Main
                    map={game.map}
                    updateMap={functions.uploadMap}
                    current={current}
                    game={game}
                    scoreboard={scoreboard}
                />
            )}
        </div>
    );
};

export default Multiplayer;
