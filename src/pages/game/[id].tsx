import ScoreBoard from '../../components/ScoreBoard';
import { useGame } from '../../lib/front/game';

const code = `void FELADAT() {
    Console.WriteLine("hello world");
}`;

const GameObject = () => {
    const [game, { join, startGame, submit, create }] = useGame();

    return (
        <div>
            {game.connected ? (
                <div>
                    <div>
                        <div>Code: {game.code}</div>
                        <div>Host: {game.host}</div>
                        <div>Phase: {game.state}</div>
                        <div>Player data: {JSON.stringify(game.players)}</div>
                        <div>
                            Scoreboard contents:{' '}
                            {JSON.stringify(game.scoreBoard)}
                        </div>
                        <div>
                            <button onClick={() => submit(code)}>
                                Submit code
                            </button>
                        </div>
                        <div>
                            <button onClick={startGame}>Start game</button>
                        </div>
                    </div>
                    <div></div>
                </div>
            ) : (
                <div>Not yet joined</div>
            )}
        </div>
    );
};

export default GameObject;
