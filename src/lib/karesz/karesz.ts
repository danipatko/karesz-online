import { field, point, direction, instruction, rotation, stats, modulo } from './karesz-utils';

// karesz session
export class kontext {
    public sizeX:number;
    public sizeY:number;
    public kareszes?:Array<karesz>;
    public matrix:Array<Array<field>>;

    constructor(sizeX:number=10, sizeY:number=10, ...players:Array<karesz>) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.kareszes = players;
        this.matrix = Array(sizeY).fill(field.empty).map(() => Array(sizeX).fill(field.empty));
        for (let i = 0; i < this.kareszes.length; i++) {
            this.kareszes[i].kontext = this;
        }
    }

    public applyAll(action:Function):void{
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
    }

    /**
     * Populate map contents from a string
     */
    load = (mapStr:string):void => {
        const arr = mapStr.split('\n');
        for (let y = 0; y < arr.length; y++)
            this.matrix[y] = arr[y].split('\t').map(x => parseInt(x));
    }
}



export class karesz {
    // Default parameters
    public position:point;
    public rotation:rotation;
    public stats:stats;
    public errorCallback:Function;
    public steps:Array<instruction> = [];
    public kontext:kontext;
    public id:string;

    // Initialization: starting position and rotation
    constructor(startPosition:point={x:0, y:0}, startRotation:rotation=rotation.up){
        this.position = startPosition;
        this.rotation = startRotation;
        this.stats = { numColor:0, numCrashes:0, numPickups:0, numSteps:0, numTurns:0, numWallchecks:0, rocksCollected:0, rocksPlaced:0 };
    }

    public isRock = (f:field):boolean => f >= 2 && f <= 5;

    public inBounds = (p:point):boolean => p && (p.x < this.kontext.sizeX && p.x >= 0) && (p.y < this.kontext.sizeY && p.y >= 0);

    private print():void {
        for (let y = 0; y < this.kontext.sizeY; y++) 
            console.log(y + ': ' + this.kontext.matrix.map(x => x[y]).join(' ') + '\n');
        console.log('-----------------------');
    }

    /**
     * Check if can step to a point
     */
    public isFieldClear = (p:point):boolean => 
        this.inBounds(p) && (this.kontext.matrix[p.x][p.y] == field.empty || this.isRock(this.kontext.matrix[p.x][p.y]));

    public forward (size:number=1):point {
        switch(this.rotation) {
            case rotation.up:
                return { x:this.position.x, y: this.position.y - size };
            case rotation.down:
                return { x:this.position.x, y: this.position.y + size };
            case rotation.right:
                return { x:this.position.x + size, y: this.position.y };
            case rotation.left:
                return { x:this.position.x - size, y: this.position.y }
        }
    }

    /**
     * Take n steps forward
     */
    public step (n:number=1):void|object {
        const targ = this.forward(n);
        if(! this.isFieldClear(targ)) { return { error:'Cannot step forward' }; }
        
        this.position = targ;
        this.steps.push({ command:'step', value:this.position });
        this.stats.numSteps++;
    }

    /**
     * Turn right (1) or left (-1)
     */
    public turn (direction:direction):void {
        this.rotation = modulo(this.rotation + direction, 4);
        this.steps.push({ command:'turn', value:this.rotation });
        this.stats.numTurns++;
    }

    /**
     * Get the content of the field under
     */
    public whatIsUnder = ():field => 
        this.kontext.matrix[this.position.x][this.position.y];
    
    /**
     * Check if rock is at player position
     */
    public isRockUnder = ():boolean => this.isRock(this.kontext.matrix[this.position.x][this.position.y]);

    /**
     * If any, pick up rock from player position
     */
    public pickUpRock():void|object {
        if(! this.isRockUnder())
            return { error:'No rock was below' };

        this.kontext.matrix[this.position.x][this.position.y] = field.empty;
        this.steps.push({ command:'pickup', value: this.position });
        this.stats.rocksCollected++;
    }

    //TODO: color
    public placeRock(color?:field):void|object {
        if(this.isRockUnder())
            return { error: 'Cannot place rock' };
                
        this.kontext.matrix[this.position.x][this.position.y] = color || field.rock_black;
        this.steps.push({ command:'place', value: { position: this.position, color: color || field.rock_black }});
        this.stats.rocksPlaced++;
    }

    /**
     * Check what is on the field in front of karesz
     */
    public whatIsInFront():field {
        const { x, y } = this.forward();
        if(! this.inBounds({x:x,y:y}))
            return -1;
        return this.kontext.matrix[x][y];
    }

    protected status():void {
        console.log(
        `           --- STATS --- 
        position: x.${this.position.x} | y.${this.position.y}
        rotation: ${this.rotation}
        under: ${this.whatIsUnder()}
        front: ${this.whatIsInFront()}
        stats: ${JSON.stringify(this.stats)}
        `);
        this.kontext._print(this.position);
    }

    // -------- "Util" functions to match Molnár's karesz --------

    public Lépj = ():void|object => this.step();
    public Fordulj_jobbra = ():void => this.turn(direction.right);
    public Fordulj_balra = ():void => this.turn(direction.left);
    public Vegyél_fel_egy_kavicsot = ():void|object => this.pickUpRock();
    public Tegyél_le_egy_kavicsot = (color?:field):void|object => this.placeRock(color);
    public Északra_néz = ():boolean => this.rotation == rotation.up;
    public Délre_néz = ():boolean => this.rotation == rotation.down;
    public Keletre_néz = ():boolean => this.rotation == rotation.left;
    public Nyugatra_néz = ():boolean => this.rotation == rotation.right;
    public Merre_néz = ():rotation => this.rotation;
    public Van_e_itt_kavics = ():boolean => this.isRockUnder();
    public Mi_van_alattam = ():field => this.whatIsUnder();
    public Van_e_előttem_fal = ():boolean => this.whatIsInFront() == field.wall;
    public Kilépek_e_a_pályáról = ():boolean => !this.inBounds(this.forward());
}

