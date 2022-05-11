import { useEffect } from 'react';
import { SocketState } from '../shared/socket';
import { MapState } from '../shared/map';

export const useMultiplayer = (socket: SocketState, map: MapState) => {
    useEffect(() => {
        // assign events to the client socket

        // map events
        socket.bind('map_update_type', ({ type }) =>
            map.functions.setType(type)
        );
        socket.bind('map_update_size', ({ width, height }) =>
            map.functions.setSize(width, height)
        );
        socket.bind('map_update_load', ({ mapName }) =>
            map.functions.loadMap(mapName)
        );
        socket.bind('map_update_object', ({ position, field }) =>
            map.functions.setField(position, field)
        );
        socket.bind('map_update_clear', () => map.functions.clearAll());
        //
    }, [socket]);

    return 0;
};

/* 
this.map = MapCreator.create().onChange(
            // type change
            (type: 'load' | 'parse') =>
                this.announce('map_update_type', { type }),
            // loaded map change
            (mapName: string) => this.announce('map_update_load', { mapName }),
            // size change
            (width: number, height: number) =>
                this.announce('map_update_size', { width, height }),
            // object change
            (position: [number, number], field: number) =>
                this.announce('map_update_object', { position, field })
        );
*/
