// import type kontext from './kontext';
import { fields, point, directions, instruction, rotations, statistics, modulo } from './karesz-utils';
import type kontext from './kontext';

export default class karesz {
    // Default parameters
    position:point = {x:0, y:0};
    rotation:rotations = rotations.up;
    stats:statistics = { numColor:0, numCrashes:0, numPickups:0, numSteps:0, numTurns:0, numWallchecks:0, rocksCollected:0, rocksPlaced:0 };
    errorCallback:Function = console.error;
    steps:string = '';
    ktxt:kontext;  // set by kontext when adding
    id:string = '';
 
    // Initialization: starting position and rotation
    constructor(startPosition:point={x:0, y:0}, startRotation:rotations=rotations.up){
        this.position = startPosition;
        this.rotation = startRotation;
        this.stats = { numColor:0, numCrashes:0, numPickups:0, numSteps:0, numTurns:0, numWallchecks:0, rocksCollected:0, rocksPlaced:0 };
    }

    isRock = (f:fields):boolean => f >= 2 && f <= 5;

    inBounds = (p:point):boolean => p && (p.x < this.ktxt.sizeX && p.x >= 0) && (p.y < this.ktxt.sizeY && p.y >= 0);

   /* private print():void {
        for (let y = 0; y < this.kontext.sizeY; y++) 
            console.log(y + ': ' + this.kontext.matrix.map(x => x[y]).join(' ') + '\n');
        console.log('-----------------------');
    }*/

    /**
     * Check if can step to a point
     */
    isFieldClear = (p:point):boolean => 
        this.inBounds(p) && (this.ktxt.matrix[p.x][p.y] == fields.empty || this.isRock(this.ktxt.matrix[p.x][p.y]));

    forward (size:number=1):point {
        switch(this.rotation) {
            case rotations.up:
                return { x:this.position.x, y: this.position.y - size };
            case rotations.down:
                return { x:this.position.x, y: this.position.y + size };
            case rotations.right:
                return { x:this.position.x + size, y: this.position.y };
            case rotations.left:
                return { x:this.position.x - size, y: this.position.y }
        }
    }

    /**
     * Take n steps forward
     */
    step (n:number=1):void|object {
        const targ = this.forward(n);
        if(! this.isFieldClear(targ)) { return { error:'Cannot step forward' }; }
        
        this.position = targ;
        this.steps += `m=${this.position.x}:${this.position.y},`;
        this.stats.numSteps++;
    }

    /**
     * Turn right (1) or left (-1)
     */
    turn (direction:directions):void {
        this.rotation = modulo(this.rotation + direction, 4);
        this.steps += `r=${this.rotation},`
        this.stats.numTurns++;
    }

    /**
     * Get the content of the field under
     */
    whatIsUnder = ():fields => 
        this.ktxt.matrix[this.position.x][this.position.y];
    
    /**
     * Check if rock is at player position
     */
    isRockUnder = ():boolean => this.isRock(this.ktxt.matrix[this.position.x][this.position.y]);

    /**
     * If any, pick up rock from player position
     */
    pickUpRock():void|object {
        if(! this.isRockUnder())
            return { error:'No rock was below' };

        this.ktxt.matrix[this.position.x][this.position.y] = fields.empty;
        this.steps += `u=${this.position.x}:${this.position.y},`;
        this.stats.rocksCollected++;
    }

    placeRock(color?:fields):void|object {
        if(this.isRockUnder())
            return { error: 'Cannot place rock' };
        this.ktxt.matrix[this.position.x][this.position.y] = color || fields.rock_black;
        this.steps += `d=${this.position.x}:${this.position.y},`;        
        this.stats.rocksPlaced++;
    }

    /**
     * Check what is on the field in front of karesz
     */
    whatIsInFront():fields {
        const { x, y } = this.forward();
        if(! this.inBounds({x:x,y:y}))
            return -1;
        return this.ktxt.matrix[x][y];
    }

   /* protected status():void {
        console.log(
        `           --- STATS --- 
        position: x.${this.position.x} | y.${this.position.y}
        rotation: ${this.rotation}
        under: ${this.whatIsUnder()}
        front: ${this.whatIsInFront()}
        stats: ${JSON.stringify(this.stats)}
        `);
        this.kontext._print(this.position);
    }*/

    // -------- Util functions to match Molnar's karesz --------

    Lepj = ():void|object => this.step();
    Fordulj_jobbra = ():void => this.turn(directions.right);
    Fordulj_balra = ():void => this.turn(directions.left);
    Vegyel_fel_egy_kavicsot = ():void|object => this.pickUpRock();
    Tegyel_le_egy_kavicsot = (color?:fields):void|object => this.placeRock(color);
    Eszakra_nez = ():boolean => this.rotation == rotations.up;
    Delre_nez = ():boolean => this.rotation == rotations.down;
    Keletre_nez = ():boolean => this.rotation == rotations.left;
    Nyugatra_nez = ():boolean => this.rotation == rotations.right;
    Merre_nez = ():rotations => this.rotation;
    Van_e_itt_kavics = ():boolean => this.isRockUnder();
    Mi_van_alattam = ():fields => this.whatIsUnder();
    Van_e_elottem_fal = ():boolean => this.whatIsInFront() == fields.wall;
    Kilepek_e_a_palyarol = ():boolean => !this.inBounds(this.forward());
}

