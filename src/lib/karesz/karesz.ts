import type kontext from './kontext';
import { field, point, direction, instruction, rotation, stats, modulo } from './karesz-utils';

// karesz session
export default class karesz {
    // Default parameters
    position:point = {x:0, y:0};
    rotatio:rotation = rotation.up;
    stats:stats = { numColor:0, numCrashes:0, numPickups:0, numSteps:0, numTurns:0, numWallchecks:0, rocksCollected:0, rocksPlaced:0 };
    errorCallback:Function = console.error;
    steps:Array<instruction> = [];
    ktxt?:kontext;
    id:string = '';
 
    // Initialization: starting position and rotation
    constructor(startPosition:point={x:0, y:0}, startRotation:rotation=rotation.up){
        this.position = startPosition;
        this.rotatio = startRotation;
        this.stats = { numColor:0, numCrashes:0, numPickups:0, numSteps:0, numTurns:0, numWallchecks:0, rocksCollected:0, rocksPlaced:0 };
    }

    isRock = (f:field):boolean => f >= 2 && f <= 5;
/*
    inBounds = (p:point):boolean => p && (p.x < this.ktxt.sizeX && p.x >= 0) && (p.y < this.ktxt.sizeY && p.y >= 0);

   /* private print():void {
        for (let y = 0; y < this.kontext.sizeY; y++) 
            console.log(y + ': ' + this.kontext.matrix.map(x => x[y]).join(' ') + '\n');
        console.log('-----------------------');
    }*/

    /**
     * Check if can step to a point
     */
/*    isFieldClear = (p:point):boolean => 
        this.inBounds(p) && (this.ktxt.matrix[p.x][p.y] == field.empty || this.isRock(this.ktxt.matrix[p.x][p.y]));

    forward (size:number=1):point {
        switch(this.rotatio) {
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
/*    step (n:number=1):void|object {
        const targ = this.forward(n);
        if(! this.isFieldClear(targ)) { return { error:'Cannot step forward' }; }
        
        this.position = targ;
        this.steps.push({ command:'step', value:this.position });
        this.stats.numSteps++;
    }

    /**
     * Turn right (1) or left (-1)
     */
/*    turn (direction:direction):void {
        this.rotatio = modulo(this.rotatio + direction, 4);
        this.steps.push({ command:'turn', value:this.rotatio });
        this.stats.numTurns++;
    }

    /**
     * Get the content of the field under
     */
/*    whatIsUnder = ():field => 
        this.ktxt.matrix[this.position.x][this.position.y];
    
    /**
     * Check if rock is at player position
     */
/*    isRockUnder = ():boolean => this.isRock(this.ktxt.matrix[this.position.x][this.position.y]);

    /**
     * If any, pick up rock from player position
     */
/*    pickUpRock():void|object {
        if(! this.isRockUnder())
            return { error:'No rock was below' };

        this.ktxt.matrix[this.position.x][this.position.y] = field.empty;
        this.steps.push({ command:'pickup', value: this.position });
        this.stats.rocksCollected++;
    }

    placeRock(color?:field):void|object {
        if(this.isRockUnder())
            return { error: 'Cannot place rock' };
                
        this.ktxt.matrix[this.position.x][this.position.y] = color || field.rock_black;
        this.steps.push({ command:'place', value: { position: this.position, color: color || field.rock_black }});
        this.stats.rocksPlaced++;
    }

    /**
     * Check what is on the field in front of karesz
     */
/*    whatIsInFront():field {
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
/*
    Lepj = ():void|object => this.step();
    Fordulj_jobbra = ():void => this.turn(direction.right);
    Fordulj_balra = ():void => this.turn(direction.left);
    Vegyel_fel_egy_kavicsot = ():void|object => this.pickUpRock();
    Tegyel_le_egy_kavicsot = (color?:field):void|object => this.placeRock(color);
    Eszakra_nez = ():boolean => this.rotatio == rotation.up;
    Delre_nez = ():boolean => this.rotatio == rotation.down;
    Keletre_nez = ():boolean => this.rotatio == rotation.left;
    Nyugatra_nez = ():boolean => this.rotatio == rotation.right;
    Merre_nez = ():rotation => this.rotatio;
    Van_e_itt_kavics = ():boolean => this.isRockUnder();
    Mi_van_alattam = ():field => this.whatIsUnder();
    Van_e_elottem_fal = ():boolean => this.whatIsInFront() == field.wall;
    Kilepek_e_a_palyaról = ():boolean => !this.inBounds(this.forward());*/
}

