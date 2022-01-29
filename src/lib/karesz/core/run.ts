import KareszCore from './karesz';
import { randstr, clamp } from '../util';
import type { Karesz, KareszMap } from './types';

export default class KareszRunner extends KareszCore {
    public lang:'CSHARP';   // future support in case new languages are added
    public key:string = randstr(20);    // the process should write this string out if every player made a move

    constructor(lang:'CSHARP'='CSHARP', players:Map<number, Karesz>, map?:KareszMap) {
        super(players, map);
        this.lang = lang;
    }

    /**
     * BASE COMMANDS
     * f - forward
     * r - turn right
     * l - turn left
     * w - check if wall is ahead
     * o - check if out of bounds
     * i - get field value
     * d - place rock | values: rock colors [2-5]
     * u - pick up rock
     * s - radar
     * c - check if rock is under
     */

    /**
     * Parse a line of input from the process's stdout 
     * @param input 
     */
    public parse(input:string):void|string {
        console.log(`Received input: ${input}`);
        if(input == this.key) {
            this.makeSteps();
            return;     // TODO: return kill signal if player was eliminated so that thread doesn't keep running 
        }

        // INPUT PATTERN: "[index] [command] [...value?]"
        const [index, command, value] = input.split(/\s+/gm);
        const player = this.players.get(parseInt(index));
        // invalid or removed player, return
        if(player === undefined) return;
        switch(command) {
            case 'f': 
                return this.proposeStep(player, parseInt(index));
            case 'r':
                return this.turn(player, parseInt(index), 1);
            case 'l':
                return this.turn(player, parseInt(index), -1);
            case 'w':
                return this.wallAhead(player) ? '1' : '0';
            case 'o':
                return this.edgeOfMap(player) ? '1' : '0';
            case 'i':
                return this.whatIsUnder(player).toString();
            case 'd':
                return this.placeRock(player, clamp(parseInt(value), 2, 5));
            case 'u':
                return this.pickUpRock(player);
            case 's':
                return this.radar(player).toString();
            case 'c':
                return this.isRockUnder(player) ? '1' : '0';
        }
    }

    public async run():Promise<void> {

    }

}