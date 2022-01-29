// import type kontext from './kontext';
// import { compress } from '$lib/util/util';
import { fields, point, directions, rotations, modulo } from '../util';
import type Kontext from './kontext';

/**
 * COMMANDS
 * f - step 1 forward
 * l - turn left
 * r - turn right
 * u - pick up any
 * b - place black rock
 * y - place yellow rock
 * g - place green rock
 * t - place red rock
 */

const ROCK_COLORS = {
    2: 'b',
    3: 't',
    4: 'g',
    5: 'y',
}

export default class Karesz {
    // Default parameters
    position:point = {x:0, y:0};
    rotation:rotations = rotations.up;
    errorCallback:Function = console.error;
    steps:string = '';
    ktxt:Kontext;  // set by kontext when adding
    id:string = '';
 
    constructor(startPosition:point={x:0, y:0}, startRotation:rotations=rotations.up){
        this.position = startPosition;
        this.rotation = startRotation;
    }

    isRock = (f:fields):boolean => f >= 2 && f <= 5;

    inBounds = (p:point):boolean => p && (p.x < this.ktxt.sizeX && p.x >= 0) && (p.y < this.ktxt.sizeY && p.y >= 0);

    /**
     * Check if able to step to a point
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
    step (n:number=1):object {
        const targ = this.forward(n);
        if(! this.isFieldClear(targ)) { return { error:'Cannot step forward' }; }
        
        this.position = targ;
        this.steps += 'f';
    }

    /**
     * Turn right (1) or left (-1)
     */
    turn (direction:directions):void {
        this.rotation = modulo(this.rotation + direction, 4);
        this.steps += direction == 1 ? 'r' : 'l';
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
    pickUpRock():object {
        if(! this.isRockUnder())
            return { error:'No rock was below' };

        this.ktxt.matrix[this.position.x][this.position.y] = fields.empty;
        this.steps += 'u';
    }

    placeRock(color?:fields):void|object {
        this.ktxt.matrix[this.position.x][this.position.y] = color || fields.rock_black;
        this.steps += ROCK_COLORS[color] || 'b';        
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

    // -------- Util functions to match Molnar's karesz --------

    public Lepj = ():object => this.step();
    public Fordulj_jobbra = ():void => this.turn(directions.right);
    public Fordulj_balra = ():void => this.turn(directions.left);
    public Vegyel_fel_egy_kavicsot = ():object => this.pickUpRock();
    public Tegyel_le_egy_kavicsot = (color?:fields):void|object => this.placeRock(color);
    public Eszakra_nez = ():boolean => this.rotation == rotations.up;
    public Delre_nez = ():boolean => this.rotation == rotations.down;
    public Keletre_nez = ():boolean => this.rotation == rotations.left;
    public Nyugatra_nez = ():boolean => this.rotation == rotations.right;
    public Merre_nez = ():rotations => this.rotation;
    public Van_e_itt_kavics = ():boolean => this.isRockUnder();
    public Mi_van_alattam = ():fields => this.whatIsUnder();
    public Van_e_elottem_fal = ():boolean => this.whatIsInFront() == fields.wall;
    public Kilepek_e_a_palyarol = ():boolean => !this.inBounds(this.forward());

    public getSteps():string {
        return this.steps; // compress(this.steps);
    }

    public parseExec(s:string):any {
        if(!s) return;
        const [command, value] = s.split(' ');

        switch(command.trim().toLocaleLowerCase()) {
            case 'step': 
                return this.Lepj();
            case 'turn': 
                this.turn(parseInt(value || '0'));
            break;
            case 'pickup': 
                return this.Vegyel_fel_egy_kavicsot();
            case 'place': 
                this.Tegyel_le_egy_kavicsot(parseInt(value) || fields.rock_black);
            break; 
            case 'left': return this.Nyugatra_nez();
            case 'right': return this.Keletre_nez();
            case 'up': return this.Eszakra_nez();
            case 'down': return this.Delre_nez();
            case 'look': return this.Merre_nez();
            case 'isrock': return this.isRockUnder();
            case 'under': return this.whatIsUnder();
            case 'wallahead': return this.Van_e_elottem_fal();
            case 'outofbounds': return this.Kilepek_e_a_palyarol();
            default:
                break;
        }
        
        return undefined;
    }
}

