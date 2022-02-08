import KareszCore from './karesz';
import { randstr, clamp } from '../util';
import type { Karesz, KareszMap } from './types';
import run from '../languages/csharp/runner';

// bruh xd
// const BASE_PATH = '/mnt/c/Users/Dani/home/Projects/karesz-online/testing';  // WSL
// const BASE_PATH = '/home/karesz-online/testing';  // WSL ROOT
// const BASE_PATH = 'C://Users/Dani/home/Projects/karesz-online/testing';  // WINDOWS
// const BASE_PATH = '/home/dapa/Projects/karesz-online/testing';   // NOTEBOOK
const BASE_PATH = '/home/liveuser/Projects/karesz-online/testing';   // PENDRIVE

export default class KareszRunner extends KareszCore {
    public lang:'CSHARP';   // future support in case new languages are added

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
    public parse = (input:string, write:(s:string)=>void, kill:(signal:NodeJS.Signals)=>void):void => {
        // io: one character, either '<' for stdout or '>' for stdin
        const [key, index, io, command, value] = input.trim().split(/\s+/gm);

        // console.log(`key: ${key} | index: ${index} | io: ${io} | command: ${command} | value: ${value}`);

        // ignore debug logs
        if(index === undefined || io === undefined || command === undefined) return;

        const player = this.players.get(parseInt(index));
        // invalid or removed player, return
        if(player === undefined) { 
            console.log(`player ${index} was undefined`);
            return;
        }

        player.steps += command;

        switch(command) {
            case 'f': 
                this.proposeStep(player, parseInt(index));
            case 'r':
                this.turn(player, parseInt(index), 1);
            case 'l':
                this.turn(player, parseInt(index), -1);
            case 'w':
                write(this.wallAhead(player) ? '1' : '0');
            case 'o':
                write(this.edgeOfMap(player) ? '1' : '0');
            case 'i':
                write(this.whatIsUnder(player).toString());
            case 'd':
                this.placeRock(player, clamp(parseInt(value), 2, 5));
            case 'u':
                this.pickUpRock(player);
            case 's':
                write(this.radar(player).toString());
            case 'c':
                write(this.isRockUnder(player) ? '1' : '0');
            case 'k': 
                write(this.direction(player).toString());
            case 'v':
                write(player.rotation == parseInt(value) ? '1' : '0');
            case 't':
                this.turn(player, parseInt(index), clamp(parseInt(value), -1, 1));
        }
    }

    public async run({ code }:{ code:string|string[] }):Promise<void> {
        // for future languages
        // if(this.lang == 'CSHARP') {
        await run({ code, basePath:BASE_PATH, dataParser:this.parse });

        // }
    }

}