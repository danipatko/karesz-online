import { MapSettings } from './settings/map';
import { MapState } from '../../lib/hooks/singleplayer/map';
import { SpawnState } from '../../lib/hooks/singleplayer/spawn';
import { SpawnSettings } from './settings/spawn';
import { Switch } from './Util';

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
            <div className='flex-1 relative'>
                <div className='flex justify-end'>
                    <Switch
                        value={map.editMode}
                        option1='edit'
                        option2='view'
                        onClick={map.functions.switchView}
                    />
                </div>
                {!map.editMode && (
                    <div className='w-full absolute h-full opacity-90 bg-lback rounded-md z-20'></div>
                )}
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
