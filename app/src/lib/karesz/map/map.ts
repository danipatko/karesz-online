import { GameMap, IGameMap } from '../../shared/types';
import { pointToString } from '../../shared/util';
export class MapCreator implements GameMap {
    public type: 'load' | 'parse' = 'load';
    public width: number = 20;
    public height: number = 20;
    public mapName: string = '';
    public objects: Map<string, number> = new Map();
    // event handlers
    private objectChange:
        | ((position: [number, number], field: number) => void)
        | null = null;
    private loadChange: ((mapName: string) => void) | null = null;
    private typeChange: ((type: 'load' | 'parse') => void) | null = null;
    private sizeChange: ((width: number, height: number) => void) | null = null;
    private clearChange: (() => void) | null = null;

    public static create(): MapCreator {
        const map = new MapCreator();
        return map;
    }

    // fetch all data about the map (for new players)
    public fetch(): IGameMap {
        return {
            type: this.type,
            width: this.width,
            height: this.height,
            mapName: this.mapName,
            objects: Array.from(this.objects.entries()),
        };
    }

    // bind event handles to map attributes
    public onChange(
        typeChange: (type: 'load' | 'parse') => void,
        loadChange: (mapName: string) => void,
        sizeChange: (width: number, height: number) => void,
        clearChange: () => void,
        objectChange: (position: [number, number], field: number) => void
    ): MapCreator {
        this.typeChange = typeChange;
        this.sizeChange = sizeChange;
        this.loadChange = loadChange;
        this.clearChange = clearChange;
        this.objectChange = objectChange;
        return this;
    }

    // set the map type
    public setType(type: 'load' | 'parse'): void {
        this.type = type;
        this.typeChange && this.typeChange(type);
    }

    // set the map size
    public setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.sizeChange && this.sizeChange(width, height);
    }

    // set the map name
    public loadMap(mapName: string): void {
        this.mapName = mapName;
        this.loadChange && this.loadChange(mapName);
    }

    // set a tile
    public addObject(position: [number, number], field: number): void {
        if (field < 1) this.objects.delete(pointToString(position));
        else this.objects.set(pointToString(position), field);
        this.objectChange && this.objectChange(position, field);
    }

    // clear the map
    public clear(): void {
        this.objects.clear();
        this.clearChange && this.clearChange();
    }
}
