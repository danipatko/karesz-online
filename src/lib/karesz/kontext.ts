import type karesz from "./karesz";
import { fields } from "./karesz-utils";

export default class kontext {
    sizeX:number = 10;
    sizeY:number = 10;
    kareszes:Array<karesz> = [];
    matrix:Array<Array<fields>> = [[]];

    constructor(_sizeX:number=10, _sizeY:number=10) {
        this.sizeX = _sizeX;
        this.sizeY = _sizeY;
        this.matrix = Array(_sizeY).fill(fields.empty).map(() => Array(_sizeX).fill(fields.empty));
    }

    addKaresz(k:karesz):void {
        k.ktxt = this;
        this.kareszes.push(k);
    }

    /**
     * Populate map contents from a string
     */
    load = (mapStr:string):void => {
        const arr = mapStr.split('\n');
        for (let y = 0; y < arr.length; y++)
            this.matrix[y] = arr[y].split('').map(x => parseInt(x));
    }
}