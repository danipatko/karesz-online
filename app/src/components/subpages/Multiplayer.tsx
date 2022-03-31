import { Game, GameState } from '../../lib/hooks/game';
import PreJoin from '../multi/PreJoin';

const Multiplayer = ({
    game,
    functions,
}: {
    game: Game;
    functions: {
        startGame: () => void;
        submit: (s: string) => void;
        prejoin: (code: number) => void;
        join: (name: string) => void;
    };
}) => {
    return (
        <div className='w-full flex justify-center items-center'>
            <div>
                Multiplayer
                <div>{game.connected ? 'Connected' : 'Not connected'}</div>
                <div>
                    {game.state === GameState.disconnected ? (
                        <PreJoin code={1} onJoin={() => {}} playerCount={2} />
                    ) : game.state === GameState.prejoin ? (
                        'Enter display name'
                    ) : game.state === GameState.notfound ? (
                        'Not found'
                    ) : (
                        'Connected'
                    )}
                </div>
            </div>
        </div>
    );
};

export default Multiplayer;
