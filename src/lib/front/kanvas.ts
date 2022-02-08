import { Point, Karesz, KareszMap, Rotation, Field, State } from '$lib/karesz/core/types';



export default class KareszRenderer {
   
    protected map:KareszMap;
    public players:Map<number, Karesz> = new Map<number, Karesz>();
    protected readonly ctx: CanvasRenderingContext2D;
    protected readonly canvas: HTMLCanvasElement;

    constructor({ map, size, canvas }:{ map?:KareszMap, size?:Point, canvas:HTMLCanvasElement }) {
        this.map = map === undefined ? { matrix: Array(size.x ?? 10).fill(size.y ?? Field.empty).map(() => Array(10).fill(Field.empty)), sizeX:10, sizeY:10 } : map;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }


}

/*import { fields, modulo, rotations } from '$lib/util/karesz';

export class Kanvas {

    public sizeX: number;
    public sizeY: number;
    public matrix: Array<Array<fields>>;
    public karesz:karesz;
    public wallWidth:number;
    public settings: object = {
        foreground_color: '#000',
        background_color: '#fff',
        separator_color: '#000',
        wall_color: '#f00',
        karesz_color: '#00f'
    };
    protected cellSize: number;
    public ctx: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;
    public startState = {
        position: { x:0, y:0 },
        rotation: rotations.up
    };
    private resumeState = {
        position: {x:0, y:0},
        rotation: 0
    };
    private updateCallback:(position:point, rotation:rotations, index:number, running:boolean) => void;

    constructor(gridSizeX:number, gridSizeY:number, canvas: HTMLCanvasElement, updateCallback:(position:point, rotation:rotations, index:number, running:boolean) => void) {
        this.sizeX = gridSizeX;
        this.sizeY = gridSizeY;
        this.canvas = canvas;
        this.resize(false);
        this.matrix = this.empty2DArray();
        this.setStartingState({ x: Math.floor(this.sizeX / 2), y: Math.floor(this.sizeY / 2) }, rotations.up);
        this.updateCallback = updateCallback;
        this.karesz = { hidden:false, id:'karesz', position:this.startState.position, rotation:this.startState.rotation };
        this.update();
    }

    private update ():void {
        this.updateCallback(this.karesz.position, this.karesz.rotation, this.i, this.running);
    }

    private empty2DArray = (x:number=this.sizeX, y:number=this.sizeY):number[][] =>
        Array(x).fill(fields.empty).map(() => Array(y).fill(fields.empty));

    public resize(render:boolean=true):void {
        this.cellSize = Math.min(Math.floor(this.canvas.width / this.sizeX), Math.floor(this.canvas.height / this.sizeY))
        this.ctx = this.canvas.getContext('2d');
        // this.canvas.width++;
        // this.canvas.height++;
        if(render) this.render();
    }

    public resetCells(size:number):void {
        this.sizeX = size;
        this.sizeY = size;
        console.log(`${this.sizeX}:${this.sizeY}`);
        this.matrix = this.empty2DArray();
        this.resize();
    }

    private drawGrid ():void {
        this.ctx.fillStyle = this.settings['background_color'];
        this.ctx.fillRect(0, 0, this.sizeX * this.cellSize, this.sizeY * this.cellSize);
        this.ctx.fillStyle = this.settings['separator_color'];
        // horizontal
        for (let y = 0; y < this.sizeY * this.cellSize + 1; y+=this.cellSize) 
            this.ctx.fillRect(0, y, this.sizeX * this.cellSize, 1);
        // vertical
        for (let x = 0; x < this.sizeX * this.cellSize + 1; x+=this.cellSize) 
            this.ctx.fillRect(x, 0, 1, this.sizeY * this.cellSize);
    }

    private drawSquare(position:point, color:string='#000'):void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect((position.x*this.cellSize)+1, (position.y*this.cellSize)+1, this.cellSize-1, this.cellSize-1);
    }

    private drawCircle(position:point, color:string='#000'):void{
        this.ctx.beginPath();
        this.ctx.arc((position.x*this.cellSize)+(this.cellSize/2), (position.y*this.cellSize)+(this.cellSize/2), (this.cellSize/2)-2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill(); 
    }

    private drawIMG(position:point, source:string):void {
        var img = new Image();
        img.onload = () => 
            this.ctx.drawImage(img, (position.x*this.cellSize)+2, (position.y*this.cellSize)+2, this.cellSize - 3, this.cellSize - 3);
        img.src = source;
    }

    /**
     * Draw the surroundings (walls and rocks)
     /
     private drawMap():void {
        for (let x = 0; x < this.matrix.length; x++) {
            for (let y = 0; y < this.matrix[x].length; y++) {
                if(this.matrix[x][y] == fields.empty) 
                    continue;
                else if (this.matrix[x][y] == fields.wall)
                    this.drawSquare({x, y}, this.settings['wall_color']);
                else if (this.matrix[x][y] > 1) 
                    this.drawCircle({x,y}, ROCK_COLORS[this.matrix[x][y]]);
            }
        }
    }

    private drawKaresz(k:karesz):void {
        this.drawIMG({x:k.position.x, y:k.position.y}, `/karesz/Karesz${k.rotation}.png`);
    }

    private forward (size:number=1):point {
        switch(this.karesz.rotation) {
            case rotations.up:
                return { x:this.karesz.position.x, y: this.karesz.position.y - size };
            case rotations.down:
                return { x:this.karesz.position.x, y: this.karesz.position.y + size };
            case rotations.right:
                return { x:this.karesz.position.x + size, y: this.karesz.position.y };
            case rotations.left:
                return { x:this.karesz.position.x - size, y: this.karesz.position.y }
        }
    }

    private run(step:string, i:number, render:boolean=true):void {
        // console.log(instruction);   // DEBUG
        this.clear();
        this.lastTickIndex = i;
        switch (step[0]) {
            case 'f':
                this.karesz.position = this.forward();
                break;
            case 'r':
                this.karesz.rotation = modulo(this.karesz.rotation+1, 4);
                break;
            case 'l':
                this.karesz.rotation = modulo(this.karesz.rotation-1, 4);
                break;
            case 'u':
                this.matrix[this.karesz.position.x][this.karesz.position.y] = 0;
                break;
            default:
                this.matrix[this.karesz.position.x][this.karesz.position.y] = ROCK_COLORS[step[0]] || 0;
                break;
        }
        if (render) this.render();
    }

    /* run specific variables 
    private lastTickIndex:number = 0;
    private i:number = 0;
    public running:boolean = false;
    private tickSpeed:number = 100;

    public setTickSpeed(ms:number):void {
        this.tickSpeed = ms;
    }

    private setState ({ rotation=rotations.up, position={ x:0, y:0 }}={}):void {
        this.karesz.position = position;
        this.karesz.rotation = rotation;
    }

    public setStartingState(startingPoint:point=this.karesz.position, startingRotation:rotations=this.karesz.rotation):void {
        this.startState.position = startingPoint;
        this.startState.rotation = startingRotation;
    }


    private steps:string;
    public set(s:string):void {
        this.steps = s; // decompress(b);
    }

    public getStepsDisplay():Array<string> {
        const result:Array<string> = [];
        for(var i = 0; i < this.steps.length; i++) {
            switch(this.steps[i]) {
                case 'f': result.push(`Move forward`); break;
                case 'l': result.push(`Turn left`); break;
                case 'r': result.push(`Turn right`); break;
                case 'u': result.push(`Pick up rock`); break;
                default: result.push(`Place ${{b:'black',t:'red',g:'green',y:'yellow'}[this.steps[i]]} rock`); break;
            }
        }
        return result;
    }

    public async play (resume:boolean=false, onstop:Function, onUpdate:Function):Promise<void> {
        return new Promise<void>(async res => {
            // stop if running
            if (this.running) { this.stop(); res(); return; }
            // reset if reached end of instructions
            if (this.i >= this.steps.length) this.reset(false);
            // load previous state 
            if(resume && !(this.i >= this.steps.length || this.lastTickIndex < 1)) {
                this.i = this.lastTickIndex;
                this.setState(this.resumeState);
            } else {
                this.i = 0;
                this.setState(this.startState);
            }
            this.update();
            // loop
            this.running = true;
            while(this.running) {
                if(this.i >= this.steps.length-1) this.running = false; 
                if(this.steps[this.i] === undefined) continue;
                onUpdate(this.i);
                this.run(this.steps[this.i], this.i++);
                this.update();
                await sleep(this.tickSpeed);
            }
            // callback for start button
            onstop(false);
            res();
        });
    }

    public jumpToStep(index:number):void {
        this.reset(false);
        if(index > this.steps.length || this.running) return;
        for (let i = 0; i <= index; i++) 
            this.run(this.steps[i], i, false);
        this.i = index;
        this.resumeState.position = this.karesz.position;
        this.resumeState.rotation = this.karesz.rotation;
        this.update();
        this.render();
    }

    public stop():void {
        this.running = false;
        this.lastTickIndex = this.i;
        this.update();
        this.resumeState.position = this.karesz.position;
        this.resumeState.rotation = this.karesz.rotation;
    }

    public clear():void {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    public render ():void {
        this.clear();
        this.drawGrid();
        this.drawMap();
        this.drawKaresz(this.karesz);
    }

    public changeField (p:point, field:fields):void {
        console.log(`${this.matrix.length}:${this.matrix[0].length}`);
        console.log(p);
        if(p.x >= this.sizeX || p.y >= this.sizeY || this.karesz.position == p) return;
        this.matrix[p.x][p.y] = this.matrix[p.x][p.y] == field ? 0 : field;
        this.render();
    }

    private equals (p1:point, p2:point):boolean {
        return p1.x == p2.x && p1.y == p2.y;
    }

    public changeKareszPosition (p:point):void {
        if(this.running || p.x >= this.sizeX || p.y >= this.sizeY) return;
        if(this.equals(this.karesz.position, p)) 
            this.karesz.rotation = modulo(this.karesz.rotation + 1, 4);
        else 
            this.karesz.position = p;
        this.update();
        this.render();
    }

    public getClickPoint(e:MouseEvent):point {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: Math.floor((e.clientX - rect.left) / this.cellSize),
            y: Math.floor((e.clientY - rect.top) / this.cellSize)
        };
    }

    public reset (render:boolean=true):void {
        this.stop();
        this.i = 0;
        this.lastTickIndex = 0;
        this.karesz.position = this.startState.position;
        this.karesz.rotation = this.startState.rotation;
        if(render) {
            this.matrix = this.empty2DArray();
            this.clear();
            this.render();
        }
    }

    public toStart():void {
        this.stop();
        this.i = 0;
        this.lastTickIndex = 0;
        this.karesz.position = this.startState.position;
        this.karesz.rotation = this.startState.rotation;
        this.render();
    }

    public generateMapData():object {
        return {
            sizeX: this.sizeX,
            sizeY: this.sizeY,
            startX: this.startState.position.x,
            startY: this.startState.position.y,
            startRotation: this.startState.rotation,
            map: this.matrix.map(x => x.join('')).join('\n'),
        }
    }
    
}

const sleep = (ms:number):Promise<void> =>
    new Promise(res => setTimeout(res, ms));

export interface instruction {
    command:string,
    value?:any
}*/