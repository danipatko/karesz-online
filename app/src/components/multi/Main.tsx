import { useState } from 'react';
import { Game, ScoreBoard } from '../../lib/hooks/game';
import Playback from '../playback/Playback';
import Players from './Players';
import Scoreboard from './Scoreboard';
import Submit from './Submit';

const Main = ({
    game,
    scoreboard,
    current,
}: {
    game: Game;
    scoreboard: ScoreBoard | null;
    current: string;
}) => {
    const [submitShown, showSubmit] = useState<boolean>(false);

    return (
        <div>
            <div className='flex items-center mx-3'>
                <div className='text-3xl font-bold p-5'>#{game.code}</div>
                <Players
                    players={Object.keys(game.players).map(
                        (x) => game.players[x]
                    )}
                    host={game.host}
                />
            </div>
            <div className='flex m-5 gap-4'>
                <div className='flex-1'>
                    <Playback onClick={() => {}} showGrid={true} size={20} />
                </div>
                <div className='flex-1 flex flex-col gap-4'>
                    <Scoreboard sb={scoreboard} />
                    <Submit
                        current={current}
                        hide={() => showSubmit(false)}
                        onSubmit={() => {}}
                        shown={submitShown}
                    />
                    <div className='flex-1 bg-slate-800'></div>
                    <div className='flex-1 bg-slate-800'>
                        <button onClick={() => showSubmit(true)} className=''>
                            SUBMIT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
