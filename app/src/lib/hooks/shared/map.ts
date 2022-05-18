import React, { Dispatch, SetStateAction, useState } from 'react';
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
        setSize: (width: number, height: number) => void;
        loadMap: (mapName: string) => void;
        clearAll: () => void;
        setField: (position: [number, number], field?: number) => void;
        setToView: () => void;
        setCurrent: (field: number) => void;
        setViewMap: (map: GameMap) => void;
    };
};

const useMap = (): MapState => {
    const [viewMap, setViewMap] = useState<GameMap>({
        ...defaultMap,
        objects: new Map(),
    });
    const [current, setCurrent] = useState<number>(0);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editorMap, setEditorMap] = useState<GameMap>({
        ...defaultMap,
        objects: new Map(),
    });

    // set the type of the map
    const setType = (type: 'parse' | 'load') =>
        setEditorMap((m) => ({ ...m, type, mapName: '' }));

    // set the size of the map
    const setSize = (width: number, height: number) =>
        setEditorMap((m) => ({
            ...m,
            width,
            height,
            type: 'parse',
            mapName: '',
        }));

    // TODO: load a map
    const loadMap = (mapName: string) =>
        setEditorMap((m) => ({ ...m, mapName, type: 'load' }));

    // set a field of the map
    const setField = (position: [number, number], field?: number) => {
        console.log(
            `set field at ${position} to ${field ?? current}`,
            defaultMap
        );
        const placement = field ?? current;
        setEditorMap((map) => {
            if (placement > 0)
                map.objects.set(pointToString(position), placement);
            else map.objects.delete(pointToString(position));
            return { ...map };
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
    const setToView = () => setViewMap(editorMap);

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
            setType,
            setSize,
            getWalls,
            setField,
            clearAll,
            setToView,
            switchView,
            setCurrent,
            setViewMap,
        },
    };
};

export default useMap;
