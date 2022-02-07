import KareszCore from './karesz';
import { randstr, clamp } from '../util';
import type { Karesz, KareszMap } from './types';
import run from '../languages/csharp/runner';

const BASE_PATH = '/mnt/c/Users/Dani/home/Projects/karesz-online/testing';  // WSL
// const BASE_PATH = 'C://Users/Dani/home/Projects/karesz-online/testing';  // WINDOWS
// const BASE_PATH = '/home/dapa/Projects/karesz-online/testing';   // NOTEBOOK
// const BASE_PATH = '/home/liveuser/Projects/karesz-online/testing';   // PENDRIVE

export default class KareszRunner extends KareszCore {
    public lang:'CSHARP';   // future support in case new languages are added
    public readonly key:string = randstr(10);    // before every command in stdin

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
     * INPUT PATTERN: "[key] [i/o] [index] [command] [...value?]"
     * @param input 
     */
    public parse(input:string, write:(s:string)=>void, kill:(signal:NodeJS.Signals)=>void):void|string {
        console.log(`Received input: '${input}'`);
        if(input.trim() == this.key) {
            this.makeSteps();
            this.makeRemovals();
            return;     // TODO: return kill signal if player was eliminated so that thread doesn't keep running 
        }

        // io: one character, either '<' for stdout or '>' for stdin
        const [io, key, index, command, value] = input.trim().split(/\s+/gm);

        console.log('HEHEHEHEHAH');
        console.log(command);

        // ignore debug logs
        if(key !== this.key  || index === undefined) return;
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
            case 'k': 
                return this.direction(player).toString();
            case 'v':
                return player.rotation == parseInt(value) ? '1' : '0';
            case 't':
                return this.turn(player, parseInt(index), clamp(parseInt(value), -1, 1));
        }
    }

    public async run({ code }:{ code:string|string[] }):Promise<void> {
        // for future languages
        // if(this.lang == 'CSHARP') {
        run({ code, basePath:BASE_PATH, dataParser:this.parse, key:this.key });

        // }
    }

}