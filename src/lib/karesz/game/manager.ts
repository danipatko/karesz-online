import { KareszMap, Field, FIELD_VALUES, Karesz, Rotation } from '../core/types';

export default class KareszManager {

    private map: KareszMap;
    private players: Map<number, Karesz>;

    constructor(){
        this.players = new Map<number, Karesz>();
        this.fillMap({ sizeX:10, sizeY:10 });
    }

    /** 
     * fill map with empty fields
     */ 
    private fillMap({ sizeX, sizeY }:{ sizeX:number; sizeY:number; }) {
        this.map = { sizeX, sizeY, 
            matrix:Array(sizeX).fill(Field.empty).map(() => Array(sizeY).fill(Field.empty))
        }    
    }

    /**
     * Parse a string as a matrix. 
     */
    private parseMapAsString(s:string, separator:string='\n') {
        this.map.matrix = s.split(separator).map(x => x.split('').map(x => FIELD_VALUES[parseInt(x)] ?? Field.empty));
    }

    /**
     * Append a new player.
     * @returns the index of the current player
     */
    public addKaresz({ 
        position:{ 
            x = this.map.sizeX/2,
            y=this.map.sizeY/2 
        }, 
        rotation=Rotation.up,
        name
    }:{ 
        position:{ 
            x:number; 
            y:number; 
        }; 
        rotation:Rotation;
        name:string; 
    }) {
        this.players.set(this.players.size, { id:name, position:{ x, y }, rotation, steps:'', startState:{ position:{ x:0, y:0 }, rotation:Rotation.up } });
        return this.players.size - 1;
    }

    /**
     * Remove a player by it's index
     */
    public removeKaresz(index:number=0) {
        this.players.delete(index);
    }

}