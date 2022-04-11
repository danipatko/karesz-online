import { useState } from 'react';
import { Game, ScoreBoard } from '../../lib/hooks/game';
import useMap from '../../lib/hooks/map';
import Playback from '../playback/Playback';
import MapEditor from './MapEditor';
import Players from './Players';
import Scoreboard from './Scoreboard';
import Submit from './Submit';

const Main = ({
    map,
    game,
    current,
    updateMap,
    scoreboard,
}: {
    map: {
        map: { [key: string]: number };
        size: number;
    };
    game: Game;
    current: string;
    updateMap: (config: {
        map: { [key: string]: number };
        size: number;
    }) => void;
    scoreboard: ScoreBoard | null;
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
                onSubmit={() => updateMap(getMap())}
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
                        view={_map.view}
                        onClick={(x, y) => setBlock(x, y, selected)}
                        showGrid={true}
                        playbackObjects={map.map}
                        editorObjects={_map.objects}
                    />
                </div>
                <div className='flex-1 flex flex-col gap-4'>
                    <Scoreboard sb={scoreboard} />
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
