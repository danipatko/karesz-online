import { useState } from 'react';
import { maps } from '../../shared/maps';
import { GameMap } from '../../shared/types';
import { pointToString, stringToPoint } from '../../shared/util';

const defaultMap: GameMap = {
    type: 'parse',
    width: 20,
    height: 20,
    mapName: '',
    objects: new Map(),
};

export type GameMapEntries = {
    width: number;
    height: number;
    mapName: string;
    type: 'parse' | 'load';
    objects: [string, number][];
};

export type MapState = {
    current: GameMap;
    viewMap: GameMap;
    editMode: boolean;
    selected: number;
    functions: {
        get: () => GameMapEntries;
        set: (map: GameMap) => void;
        edit: () => void;
        switchView: () => void;
        getWalls: () => [number, number][];
        setType: (type: 'parse' | 'load') => void;
        emitType: (type: 'parse' | 'load') => void;
        setSize: (width: number, height: number) => void;
        emitSize: (width: number, height: number) => void;
        loadMap: (mapName: string) => void;
        emitLoadMap: (mapName: string) => void;
        clearAll: () => void;
        emitClearAll: () => void;
        setField: (position: [number, number], field?: number) => void;
        emitField: (position: [number, number], field?: number) => void;
        setToView: () => void;
        setCurrent: (field: number) => void;
        setViewMap: (map: GameMap) => void;
    };
};

const useMap = (
    emit?: ((ev: string, ...args: any[]) => void) | null
): MapState => {
    const [viewMap, setViewMap] = useState<GameMap>({
        ...defaultMap,
        objects: new Map<string, number>(),
    });
    const [editorMap, setEditorMap] = useState<GameMap>({
        ...defaultMap,
        objects: new Map<string, number>(),
    });
    const [current, setCurrent] = useState<number>(0);
    const [editMode, setEditMode] = useState<boolean>(false);

    // set the type of the map
    const setType = (type: 'parse' | 'load') =>
        setEditorMap((m) => ({ ...m, type, mapName: '' }));

    const emitType = (type: 'parse' | 'load') =>
        emit && emit('map_update_type', { type });

    // set the size of the map
    const setSize = (width: number, height: number) =>
        setEditorMap((m) => ({
            ...m,
            width,
            height,
            type: 'parse',
            mapName: '',
            objects: new Map(),
        }));

    const emitSize = (width: number, height: number) =>
        emit && emit('map_update_size', { width, height });

    const loadMap = (mapName: string) =>
        setEditorMap((m) => ({
            ...m,
            mapName,
            type: 'load',
            width: 41,
            height: 31,
            objects: new Map(maps[mapName]),
        }));

    const emitMap = (mapName: string) =>
        emit && emit('map_update_load', { mapName });

    // set a field of the map
    const setField = (position: [number, number], field?: number) => {
        setEditorMap((m) => {
            // copy objects
            const o = new Map(m.objects);
            if ((field ?? current) > 0)
                o.set(pointToString(position), field ?? current);
            else o.delete(pointToString(position));

            return { ...m, objects: o };
        });
    };

    // set a field of the map
    const emitField = (position: [number, number]) =>
        emit && emit('map_update_object', { position, field: current });

    // clear all
    const clearAll = () =>
        setEditorMap((m) => ({
            ...m,
            type: 'parse',
            objects: new Map(),
            mapName: '',
        }));

    const emitClearAll = () => emit && emit('map_update_clear');

    // enable editing
    const edit = () => setEditMode(true);

    // get walls
    const getWalls = (): [number, number][] => {
        const walls: [number, number][] = [];
        for (const [position, field] of viewMap.objects)
            if (field == 1) walls.push(stringToPoint(position));
        return walls;
    };

    // switch between edit and view mode
    const switchView = () => setEditMode((x) => !x);

    // get the objects
    const get = (): GameMapEntries => ({
        ...editorMap,
        objects: Array.from(editorMap.objects),
    });

    // set the entire map
    const set = (map: GameMap) => setEditorMap(map);

    // sets the view map to the editor map
    const setToView = () => {
        console.log('SETVIEW CALLED');
        setEditMode(false);
        // for some reason, accessing the value of editorMap directly returns the default value
        // TOFIX: hacky workaround
        setEditorMap((m) => {
            setViewMap(() => ({
                ...m,
                objects: new Map(m.objects),
            }));
            return { ...m };
        });
    };

    return {
        current: editMode ? editorMap : viewMap,
        viewMap,
        editMode,
        selected: current,
        functions: {
            get,
            set,
            edit,
            loadMap,
            emitLoadMap: emitMap,
            setType,
            emitType,
            setSize,
            emitSize,
            getWalls,
            setField,
            emitField,
            clearAll,
            setToView,
            switchView,
            setCurrent,
            setViewMap,
            emitClearAll,
        },
    };
};

export default useMap;
