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
    current,
    updateMap,
    scoreboard,
}: {
    game: Game;
    current: string;
    updateMap: (map: GameMap) => void;
    scoreboard: SB | null;
}) => {
    const [submitShown, showSubmit] = useState<boolean>(false);
    const [selected, setSelected] = useState<number>(0);
    const [_map, { clearAll, setBlock, setSize, setView, getMap }] = useMap();

    return (
        <div>
            <Submit
                hide={() => showSubmit(false)}
                shown={submitShown}
                current={current}
                onSubmit={() => {}}
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
                            _map.view == 'edit'
                                ? _map.size
                                : (game.map.size as 10 | 20 | 30 | 40) // ouch
                        }
                        scoreboard={scoreboard}
                        view={_map.view}
                        onClick={(x, y) => setBlock(x, y, selected)}
                        showGrid={true}
                        playbackObjects={game.map.objects}
                        editorObjects={_map.objects}
                    />
                </div>
                <div className='flex-1 flex flex-col gap-4'>
                    <Scoreboard scoreboard={scoreboard} />
                    <MapEditor
                        view={_map.view}
                        setView={setView}
                        clearAll={() => {}}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <div className='flex-1 bg-main rounded-md'>
                        <button onClick={() => showSubmit(true)} className=''>
                            SUBMIT
                        </button>
                        <div>
                            <button onClick={() => updateMap(getMap())}>
                                Sumit map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
