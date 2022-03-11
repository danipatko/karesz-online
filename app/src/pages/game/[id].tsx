import { NextPageContext } from 'next';
import Router from 'next/router';
import { useRef } from 'react';
import Game from '../../components/Game';
import PreJoin from '../../components/PreJoin';
import ScoreBoard from '../../components/ScoreBoard';
import { GameState, useGame } from '../../lib/front/game';

const code = `void FELADAT() {
    Console.WriteLine("hello world");
}`;

// Request structure: /game/[id|0]/?n=[name]
// game id zero is for creating a new game
export const getServerSideProps = async (context: NextPageContext) => {
    const { id: code } = context.query;

    if (!code)
        return {
            redirect: {
                target: '/',
            },
        };

    return {
        props: {
            code: parseInt(typeof code == 'string' ? code : code[0]),
        },
    };
};

const GameObject = ({ code }: { code: number }) => {
    const [game, { startGame, submit, join }] = useGame(code);

    return (
        <div>
            {game.state == GameState.prejoin ? (
                <PreJoin
                    onJoin={join}
                    code={game.code}
                    playerCount={game.playerCount}
                />
            ) : game.state == GameState.notfound ? (
                <div>Game not found</div>
            ) : (
                <Game game={game} />
            )}
        </div>
    );
};

export default GameObject;
