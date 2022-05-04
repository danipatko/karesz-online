import { useState } from 'react';
import { GameMap } from '../../shared/types';

const defaultMap: GameMap = {
    type: 'parse',
    width: 20,
    height: 20,
    mapName: '',
    objects: new Map(),
};

export type MapState = {
    current: GameMap;
    editMode: boolean;
    functions: {
        edit: () => void;
        save: () => void;
        cancel: () => void;
        getWalls: () => [number, number][];
        setType: (type: 'parse' | 'load') => void;
        setSize: (width: number, height: number) => void;
        loadMap: (mapName: string) => void;
        clearAll: () => void;
        setField: (position: [number, number], field: number) => void;
    };
};

const useMap = (): MapState => {
    const [map, setMap] = useState<GameMap>(defaultMap);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editorMap, setEditorMap] = useState<GameMap>(defaultMap);

    // set the type of the map
    const setType = (type: 'parse' | 'load') =>
        setMap({ ...map, type, mapName: '' });

    // set the size of the map
    const setSize = (width: number, height: number) =>
        setMap({ ...map, width, height, type: 'parse', mapName: '' });

    // TODO: load a map
    const loadMap = (mapName: string) => setMap({ ...map, mapName });

    // set a field of the map
    const setField = (position: [number, number], field: number) =>
        setMap((m) => {
            field > 0
                ? m.objects.set(position, field)
                : m.objects.delete(position);
            return { ...m };
        });

    // clear all
    const clearAll = () => setMap((m) => ({ ...m, objects: new Map() }));

    // enable editing
    const edit = () => setEditMode(true);

    // set editor map to current map
    const cancel = () => {
        setEditorMap(map);
        setEditMode(false);
    };

    // copy editor map to current map
    const save = () => {
        setMap(editorMap);
        setEditMode(false);
    };

    // get walls
    const getWalls = (): [number, number][] => {
        const walls: [number, number][] = [];
        for (const [position, field] of map.objects)
            if (field == 1) walls.push(position);
        return walls;
    };

    return {
        current: editMode ? editorMap : map,
        editMode,
        functions: {
            edit,
            save,
            cancel,
            loadMap,
            setType,
            setSize,
            getWalls,
            setField,
            clearAll,
        },
    };
};

export default useMap;
