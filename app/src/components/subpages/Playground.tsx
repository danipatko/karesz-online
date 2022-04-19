import { useState } from 'react';
import useMap from '../../lib/hooks/map';
import usePlayground from '../../lib/hooks/playground';
import CompileError from '../multi/CompileError';
import MapEditor from '../multi/MapEditor';
import Spawn from '../multi/Spawn';
import Submit from '../multi/Submit';
import Playback from '../playback/Playback';

const Playground = ({
    shown,
    current,
    onError,
}: {
    shown: boolean;
    current: string;
    onError: (error: string) => void;
}) => {
    const [
        playground,
        { run, saveMap, cycleStartingRotation, setStartingPoint },
    ] = usePlayground(onError);
    const [editor, functions] = useMap({
        isHost: true,
        map: playground.map,
    });
    const [block, setBlock] = useState<number>(0);
    const [submitShown, showSubmit] = useState<boolean>(false);
    const [choosePosition, setChoosing] = useState<boolean>(false);

    return (
        <div className={shown ? 'block' : 'hidden'}>
            <CompileError logs={playground.logs} />
            <Submit
                hide={() => showSubmit(false)}
                shown={submitShown}
                current={current}
                onSubmit={() => {
                    showSubmit(false);
                    run(current);
                }}
            />
            <div className='flex mx-5 gap-4 text-white'>
                <div className='flex-1'>
                    <Playback
                        type='sp'
                        view={editor.view}
                        onClick={(x, y) => {
                            if (choosePosition) {
                                setStartingPoint(x, y);
                                setChoosing(false);
                            } else functions.setBlock(x, y, block);
                        }}
                        setView={() => functions.setView('play')}
                        showGrid={true}
                        replayMap={playground.map}
                        editorMap={editor.map}
                        scoreboard={null}
                        roundResult={{
                            start: playground.start,
                            steps: playground.steps,
                        }}
                    >
                        <div
                            className='absolute tilesize opacity-40'
                            style={{
                                backgroundSize: 'contain',
                                backgroundImage: 'url(/karesz/karesz.png)',
                                transform: `translate(${
                                    100 * playground.start.x
                                }%,${100 * playground.start.y}%) rotate(${
                                    (playground.start.rotation % 4) * 90
                                }deg)`,
                            }}
                        ></div>
                    </Playback>
                </div>
                <div className='flex-1 flex flex-col justify-evenly items-center gap-4'>
                    <MapEditor
                        map={playground.map}
                        host={true}
                        editor={editor}
                        onSave={() => saveMap(editor.map)}
                        loadMap={functions.loadMap}
                        setType={functions.setType}
                        setSize={functions.setSize}
                        setView={functions.setView}
                        onCancel={() => functions.reset(playground.map)}
                        clearAll={functions.clearAll}
                        selected={block}
                        setSelected={setBlock}
                    />
                    <Spawn
                        start={playground.start}
                        setRotation={cycleStartingRotation}
                        setChoosing={setChoosing}
                        choosePosition={choosePosition}
                    />
                    <div>
                        <button
                            className='bg-karesz hover:bg-karesz-light rounded-md p-2 font-bold'
                            onClick={() => showSubmit(true)}
                        >
                            RUN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Playground;
