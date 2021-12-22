import { fields, rotations } from "$lib/karesz/karesz-utils";

export interface point {
    x: number;
    y: number;
}

export interface karesz {
    position: point;
    rotation: rotations;
    id: string;
    hidden:boolean;
}

const ROCK_COLORS = {
    2: '#000',
    3: '#f00',
    4: '#0f0',
    5: '#0ff',
}

export class kanvas{
    public sizeX: number;
    public sizeY: number;
    public matrix: Array<Array<fields>>;
    public kareszes:Array<karesz> = [];
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

    constructor(x:number, y:number, canvas: HTMLCanvasElement) {
        this.sizeX = x;
        this.sizeY = y;
        this.canvas = canvas;
        this.resize(false);
        this.matrix = this.empty2DArray();
    }

    private empty2DArray = (x:number=this.sizeX, y:number=this.sizeY):number[][] =>
        Array(x).fill(fields.empty).map(() => Array(y).fill(fields.empty));

    public resize(render:boolean=true):void {
        this.cellSize = Math.min(Math.floor(this.canvas.width / this.sizeX), Math.floor(this.canvas.height / this.sizeX))
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width++;
        this.canvas.height++;
        if(render) this.render();
    }

    private drawGrid ():void {
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
            this.ctx.drawImage(img, (position.x*this.cellSize)+1, (position.y*this.cellSize)+1, (this.cellSize) - 2, (this.cellSize) - 2);
        img.src = source;
    }

    /**
     * Draw the surroundings (walls and rocks)
     */
     private drawMap():void {
        for (let x = 0; x < this.matrix.length; x++) {
            for (let y = 0; y < this.matrix[x].length; y++) {
                if(this.matrix[x][y] == fields.empty) 
                    continue;
                else if (this.matrix[x][y] = fields.wall)
                    this.drawSquare({x, y}, this.settings['wall_color']);
                else if (this.matrix[x][y] > 1) 
                    this.drawCircle({x,y}, ROCK_COLORS[this.matrix[x][y]]);
            }   
        }
    }

    private drawKaresz(k:karesz):void{
        this.drawIMG({x:k.position.x, y:k.position.y}, `/karesz/karesz${k.rotation}.png`);
    }

    private runInstruction(instruction:instruction, i:number, render:boolean=true):void {
        this.clear();
        this.lastTickIndex = i;
        switch (instruction.command) {
            case 'm':
                this.kareszes[0].position = instruction.value;
                break;
            case 'r':
                this.kareszes[0].rotation = instruction.value;
                break;
            case 'u':
                this.matrix[instruction.value.x][instruction.value.y] = 0;
                break;
            case 'd':
                this.matrix[instruction.value.x][instruction.value.y] = 2;
                break;
        }
        if (render) this.render();
    }

    /* run specific variables */
    private lastTickIndex:number = 0;
    private i:number = 0;
    public running:boolean = false;
    private tickSpeed:number = 200;

    public setTickSpeed(ms:number):void {
        this.tickSpeed = ms;
    }

    // parse command
    private parse(line:string):instruction{
        const [command, val] = line.split('=');
        switch (command.trim().toLowerCase()) {
            case 'm':   // position
                const m1 = val.match(/([0-9]+):([0-9]+)/mi)
                return m1 ? { command, value: { x:parseInt(m1[1]), y:parseInt(m1[2])}} : undefined;
            case 'r':   // rotation 
                return { command, value: parseInt(val) };
            case 'u':   // pick up rock
                const m2 = val.match(/([0-9]+):([0-9]+)/mi);
                return m2 ? { command, value: {x:parseInt(m2[1]), y:parseInt(m2[2]) }} : undefined;
            case 'd':   // place rock
                const m3 = val.match(/([0-9]+):([0-9]+)/mi);
                return m3 ? { command, value: {x:parseInt(m3[1]), y:parseInt(m3[2]) }} : undefined;
            default: return undefined;
        }
    }

    public parseCommands = (instructions: string):instruction[] =>
        instructions.split(',').map(x => this.parse(x)); 

    public async play (instructions:instruction[], resume:boolean=false, playbackSpeed:number=200):Promise<void> {
        return new Promise<void>(async res => {
            if (this.running) { this.stop(); res(); return; }
            if (this.i >= instructions.length) this.reset();
            this.clear();
            this.tickSpeed = playbackSpeed;
            this.running = true;
            this.i = resume ? this.lastTickIndex : 0;
            while(this.running) {
                if(this.i >= instructions.length-1) this.running = false; 
                if(instructions[this.i] === undefined) continue;
                this.runInstruction(instructions[this.i], this.i++);
                await sleep(this.tickSpeed);
            }
            res();
        });
    }

    public jumpToStep(instructions:instruction[], index:number):void {
        this.reset(false);
        if(index > instructions.length || this.running) return;
        for (let i = 0; i <= index; i++) 
            this.runInstruction(instructions[i], i, false);
        this.render();
    }

    public stop():void {
        this.running = false;
        this.lastTickIndex = this.i;
    }

    public clear():void {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    public render ():void {
        this.clear();
        this.drawGrid();
        this.drawMap();
        this.drawKaresz(this.kareszes[0]);
    }

    public changeField (p:point, field:fields):void {
        if(p.x >= this.sizeX || p.y >= this.sizeY || this.kareszes[0].position == p) return;
        this.matrix[p.x][p.y] = field;
        this.render();
    }

    public changeKareszPosition (p:point):void {
        if(p.x >= this.sizeX || p.y >= this.sizeY) return;
        this.kareszes[0].position = p;
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
        this.matrix = this.empty2DArray();
        this.lastTickIndex = 0;
        // this.kareszes[0].position = { x: Math.floor(this.sizeX/2), y: Math.floor(this.sizeY/2) };
        this.kareszes[0].rotation = rotations.up;
        this.clear();
        if(render) this.render();
    }
}

const sleep = (ms:number):Promise<void> =>
    new Promise(res => setTimeout(res, ms));

export interface instruction {
    command:string,
    value?:any
}