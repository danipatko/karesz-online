import { Switch } from './Util';
import { MapSettings } from './settings/map';
import { SpawnSettings } from './settings/spawn';
import { MapState } from '../../lib/hooks/shared/map';
import { SpawnState } from '../../lib/hooks/singleplayer/spawn';

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
            <div className='flex justify-end'>
                <Switch
                    value={map.editMode}
                    option1='edit'
                    option2='view'
                    onClick={map.functions.switchView}
                />
            </div>
            <div className='flex-1 relative'>
                {!map.editMode && (
                    <div className='w-full absolute top-0 left-0 h-full opacity-80 bg-lback z-20'></div>
                )}
                <MapSettings map={map} />
                {spawn && <SpawnSettings spawn={spawn} />}
            </div>
            {run && (
                <div>
                    <button onClick={run} className='lightbutton w-full'>
                        run
                    </button>
                </div>
            )}
        </div>
    );
};
