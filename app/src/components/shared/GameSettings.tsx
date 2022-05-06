import { MapSettings } from './settings/map';
import { MapState } from '../../lib/hooks/singleplayer/map';
import { SpawnState } from '../../lib/hooks/singleplayer/spawn';
import { SpawnSettings } from './settings/spawn';

export const GameSettings = ({
    run,
    map,
    spawn,
}: {
    map: MapState;
    run?: () => void;
    spawn: SpawnState | null;
}) => {
    return (
        <div className='p-4 h-full flex flex-col justify-between bg-lback abg-slate-800'>
            <div className='flex-1'>
                <MapSettings map={map} />
                {spawn && <SpawnSettings spawn={spawn} />}
            </div>
            {run && (
                <div>
                    <button onClick={run} className='lightbutton w-full'>
                        RUN
                    </button>
                </div>
            )}
        </div>
    );
};
