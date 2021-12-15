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

   /* public applyAll(action:Function):void{
        for (let i = 0; i < this.kareszes.length; i++) {
            action(this.kareszes[i]);
        }
    }

    public applyFirst(action:Function):void {
        action(this.kareszes[0]);
    }

    public getKaresz(index:number):karesz {
        return this.kareszes[index];
    }

    _print = (kp?:point):void => {
        // iter vertically
        for (let y = 0; y < this.matrix.length; y++) 
            // one line
            console.log(y + ': ' + this.matrix[y].map((v, x) => kp && x == kp.x && y == kp.y ? 'K' : v ).join(' ') + '\n');
        console.log('-----------------------');
    }*/

    /**
     * Populate map contents from a string
     */
    load = (mapStr:string):void => {
        const arr = mapStr.split('\n');
        for (let y = 0; y < arr.length; y++)
            this.matrix[y] = arr[y].split('').map(x => parseInt(x));
    }
}