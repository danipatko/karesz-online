export interface point {
    x: number;
    y: number;
}

export interface entity {
    position: point;
    name: string;
    type: string;
    path: string;
    constant: boolean;
}

export interface karesz {
    position: point;
    rotation: number;
    id: string;
    path: Array<instruction>;
}

export const enitities: {
    karesz:entity,
    wall:entity,
    rock:entity
} = {
    karesz: { position: {x: 0, y:0}, name:'karesz', path:'no path yet', type:'svg', constant:false },
    wall: { position: {x: 0, y:0}, name:'wall', path:'#f00', type:'square', constant:true },
    rock: { position: {x: 0, y:0}, name:'rock', path:'#000', type:'round', constant:false }
};

export class kanvas{
    public sizeX: number;
    public sizeY: number;
    public entities:Array<entity> = [];
    public kareszes:Array<entity> = [];
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

    constructor(x:number, y:number, canvas: HTMLCanvasElement) {
        this.sizeX = x;
        this.sizeY = y;
        this.cellSize = Math.min(Math.floor(canvas.width / x), Math.floor(canvas.height / y))
        this.ctx = canvas.getContext('2d');
        canvas.width++;
        canvas.height++;
    }

    public add (position:point, type:string='svg', path:string, name:string='unnamed entity', constant:boolean=false):void {
        this.entities.push({position, name, type, path, constant});
    }
    
    public addDirect(x:entity){
        this.entities.push(x);
    }

    protected drawGrid ():void {
        this.ctx.fillStyle = this.settings['separator_color'];
        // horizontal
        for (let y = 0; y < this.sizeY * this.cellSize + 1; y+=this.cellSize) 
            this.ctx.fillRect(0, y, this.sizeX * this.cellSize, 1);
        // vertical
        for (let x = 0; x < this.sizeX * this.cellSize + 1; x+=this.cellSize) 
            this.ctx.fillRect(x, 0, 1, this.sizeY * this.cellSize);
    }

    protected drawSquare(position:point, color:string='#000'):void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect((position.x*this.cellSize)+1, (position.y*this.cellSize)+1, this.cellSize-1, this.cellSize-1);
    }

    protected drawCircle(position:point, color:string='#000'):void{
        this.ctx.beginPath();
        this.ctx.arc((position.x*this.cellSize)+(this.cellSize/2), (position.y*this.cellSize)+(this.cellSize/2), (this.cellSize/2)-2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill(); 
    }

    protected drawIMG = (position:point, source:string) => {
        var img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, (position.x*this.cellSize)+1, (position.y*this.cellSize)+1, (this.cellSize*2) - 2, (this.cellSize*2) - 2);
        }
        img.src = source;
    }

    protected drawEntities(redraw:boolean=true/*TO DO*/):void {
        for(const k in redraw ? this.entities : this.entities.filter(x => !x.constant)){
            switch (this.entities[k].type) {
                case 'square':
                    this.drawSquare(this.entities[k].position, this.entities[k].path);
                    break;
                case 'circle':
                    this.drawCircle(this.entities[k].position, this.entities[k].path);
                    break;
                default:
                    this.drawIMG(this.entities[k].position, this.entities[k].path);
                    break;
            }
        }
    }

    public render = ():void => {
        this.drawGrid();
        this.drawEntities();
    }

    protected run = (instruction:instruction) => {
        switch (instruction.command) {
            case 'step':
                break;
            
            case 'turn':
                break;
        
            default:
                break;
        }
    }

    /* run specific variables */
    public lastTickIndex:number = 0;
    public timer:any;
    public i:number = 0;

    public play = async(instructions:instruction[], fromTick:number=0, tickSpeed:number=50):Promise<void> => {
        return new Promise<void>(res => {
            this.i = fromTick;
            this.timer = setInterval(() => {
                this.run(instructions[this.i++]);
                if(this.i >= instructions.length) res();
            }, tickSpeed);
        });
    }

    public stop = () => {
        this.lastTickIndex = this.i;
        clearInterval(this.timer);
    }
}

export interface instruction {
    command:string,
    value?:any
}