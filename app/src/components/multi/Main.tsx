import Submit from './Submit';
import Players from './Players';
import { useState } from 'react';
import MapEditor from './MapEditor';
import Scoreboard from './Scoreboard';
import useMap from '../../lib/_hooks/map';
import Playback from '../playback/Playback';
import { GameMap, GamePhase } from '../../lib/shared/types';
import { Game, Scoreboard as SB } from '../../lib/_hooks/game';

const Main = ({
    game,
    isHost,
    onExit,
    isReady,
    current,
    onSubmit,
    updateMap,
    scoreboard,
}: {
    game: Game;
    onExit: () => void;
    isHost: boolean;
    isReady: boolean;
    current: string;
    onSubmit: (s: string) => void;
    updateMap: (map: GameMap) => void;
    scoreboard: SB | null;
}) => {
    const [submitShown, showSubmit] = useState<boolean>(false);
    const [block, setBlock] = useState<number>(0);
    const [editor, functions] = useMap({ isHost, map: game.map });

    return (
        <div>
            <div
                style={{
                    backgroundColor:
                        game.state === GamePhase.idle
                            ? 'rgb(34, 127, 255)'
                            : 'orange',
                }}
                className='bg-karesz-light p-[2px] overflow-hidden font-semibold text-center relative'
            >
                <div
                    style={{
                        background:
                            game.state === GamePhase.idle
                                ? 'linear-gradient(90deg, rgb(34,127,255) 0%, rgb(0,212,255) 50%, rgb(34,127,255) 100%)'
                                : 'linear-gradient(90deg, rgb(255,178,34) 0%, rgb(255,231,142) 50%, rgb(255,178,34) 100%)',
                    }}
                    className='absolute loading w-[200px] h-[20vh]'
                ></div>
                {game.state === GamePhase.idle ? (
                    <>Waiting for players...</>
                ) : (
                    <>Running</>
                )}
            </div>
            <Submit
                hide={() => showSubmit(false)}
                shown={submitShown}
                current={current}
                onSubmit={() => {
                    showSubmit(false);
                    onSubmit(current);
                }}
            />
            <div className='flex items-center mx-3'>
                <div className='text-3xl font-bold p-5'>#{game.code}</div>
                <Players
                    host={game.host}
                    players={Object.values(game.players)}
                />
                <div>
                    <button
                        onClick={onExit}
                        className='font-bold text-red-600 text:bg-red-500 p-2'
                    >
                        LEAVE GAME
                    </button>
                </div>
            </div>
            <div className='flex mx-5 gap-4'>
                <div className='flex-1'>
                    <Playback
                        type='mp'
                        view={editor.view}
                        onClick={(x, y) => functions.setBlock(x, y, block)}
                        setView={() => functions.setView('play')}
                        showGrid={true}
                        replayMap={game.map}
                        editorMap={editor.map}
                        scoreboard={scoreboard}
                        roundResult={null}
                    />
                </div>
                <div className='flex-1 flex flex-col justify-evenly items-center gap-4'>
                    <Scoreboard scoreboard={scoreboard} />
                    <MapEditor
                        map={game.map}
                        host={isHost}
                        editor={editor}
                        onSave={() => updateMap(functions.getMap())}
                        loadMap={functions.loadMap}
                        setType={functions.setType}
                        setSize={functions.setSize}
                        setView={functions.setView}
                        onCancel={() => functions.reset(game.map)}
                        clearAll={functions.clearAll}
                        selected={block}
                        setSelected={setBlock}
                    />
                    <div>
                        <button
                            className='bg-karesz hover:bg-karesz-light rounded-md p-2 font-bold '
                            onClick={() => {
                                if (isReady) onSubmit('');
                                else showSubmit(true);
                            }}
                        >
                            {isReady ? 'UNREADY' : 'READY'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
