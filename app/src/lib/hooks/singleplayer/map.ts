import { useState } from 'react';
import { GameMap } from '../../shared/types';
import { pointToString, stringToPoint } from '../../shared/util';

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
    selected: number;
    functions: {
        edit: () => void;
        save: () => void;
        cancel: () => void;
        switchView: () => void;
        getWalls: () => [number, number][];
        setType: (type: 'parse' | 'load') => void;
        setSize: (width: number, height: number) => void;
        loadMap: (mapName: string) => void;
        clearAll: () => void;
        setField: (position: [number, number]) => void;
        setCurrent: (field: number) => void;
    };
};

const useMap = (): MapState => {
    const [map, setMap] = useState<GameMap>(defaultMap);
    const [current, setCurrent] = useState<number>(0);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editorMap, setEditorMap] = useState<GameMap>(defaultMap);

    // set the type of the map
    const setType = (type: 'parse' | 'load') =>
        setEditorMap({ ...map, type, mapName: '' });

    // set the size of the map
    const setSize = (width: number, height: number) => {
        console.log(width, height);
        setEditorMap({ ...map, width, height, type: 'parse', mapName: '' });
    };

    // TODO: load a map
    const loadMap = (mapName: string) =>
        setEditorMap({ ...map, mapName, type: 'load' });

    // set a field of the map
    const setField = (position: [number, number]) => {
        console.log(`set field at ${position} to ${current}`);
        setEditorMap((m) => {
            if (current > 0) m.objects.set(pointToString(position), current);
            else m.objects.delete(pointToString(position));
            console.log(m.objects);
            return { ...m };
        });
    };

    // clear all
    const clearAll = () =>
        setEditorMap((m) => ({
            ...m,
            type: 'parse',
            objects: new Map(),
            mapName: '',
        }));

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
            if (field == 1) walls.push(stringToPoint(position));
        return walls;
    };

    // switch between edit and view mode
    const switchView = () => setEditMode((x) => !x);

    return {
        current: editMode ? editorMap : map,
        editMode,
        selected: current,
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
            switchView,
            setCurrent,
        },
    };
};

export default useMap;
