import { useState } from 'react';
import { Game, Scoreboard as SB } from '../../lib/hooks/game';
import useMap from '../../lib/hooks/map';
import { GameMap, GameState } from '../../lib/shared/types';
import Playback from '../playback/Playback';
import MapEditor from './MapEditor';
import Players from './Players';
import Scoreboard from './Scoreboard';
import Submit from './Submit';

const Main = ({
    game,
    isHost,
    isReady,
    current,
    onSubmit,
    updateMap,
    scoreboard,
}: {
    game: Game;
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
                        game.state === GameState.idle
                            ? 'rgb(34, 127, 255)'
                            : 'orange',
                }}
                className='bg-karesz-light p-[2px] overflow-hidden font-semibold text-center relative'
            >
                <div className='absolute loading w-[200px] h-[20vh] bg-gradient-to-r from-karesz-light via-blue-400 to-karesz-light'></div>
                {game.state === GameState.idle ? (
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
            </div>
            <div className='flex mx-5 gap-4'>
                <div className='flex-1'>
                    <Playback
                        view={editor.view}
                        onClick={(x, y) => functions.setBlock(x, y, block)}
                        setView={() => functions.setView('play')}
                        showGrid={true}
                        replayMap={game.map}
                        editorMap={editor.map}
                        scoreboard={scoreboard}
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
                        clearAll={() => {}}
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
