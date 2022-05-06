import { MapSettings } from './settings/map';
import { MapState } from '../../lib/hooks/singleplayer/map';
import { SpawnState } from '../../lib/hooks/singleplayer/spawn';
import { SpawnSettings } from './settings/spawn';

export const GameSettings = ({
    map,
    spawn,
}: {
    map: MapState;
    spawn: SpawnState | null;
}) => {
    return (
        <div className='p-4 h-full flex flex-col bg-lback abg-slate-800'>
            <MapSettings map={map} />
            {spawn && <SpawnSettings spawn={spawn} />}
        </div>
    );
};
