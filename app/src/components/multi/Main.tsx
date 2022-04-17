import { useState } from 'react';
import { Game, Scoreboard as SB } from '../../lib/hooks/game';
import useMap from '../../lib/hooks/map';
import { GameMap } from '../../lib/shared/types';
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
    const [editor, functions] = useMap();

    return (
        <div>
            <div>
                Ready: {isReady ? 'yes' : 'no'} State: {game.state}
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
            <div className='flex m-5 gap-4'>
                <div className='flex-1'>
                    <Playback
                        size={
                            editor.view == 'edit'
                                ? (editor.map.size as 10 | 20 | 30 | 40)
                                : (game.map.size as 10 | 20 | 30 | 40)
                        }
                        view={editor.view}
                        onClick={(x, y) => functions.setBlock(x, y, block)}
                        showGrid={true}
                        scoreboard={scoreboard}
                        editorObjects={editor.map.objects}
                        playbackObjects={game.map.objects}
                    />
                </div>
                <div className='flex-1 flex flex-col gap-4'>
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
                    <div className='flex-1 bg-main rounded-md'>
                        <button
                            onClick={() => {
                                if (isReady) onSubmit('');
                                else showSubmit(true);
                            }}
                            className=''
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
