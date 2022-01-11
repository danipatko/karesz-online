import { spawn } from 'child_process';
import fs from 'fs';
import Kontext from '../kontext';
import Karesz from '../karesz';
import path from 'path/posix';
import { parseCommand } from '../karesz-standard';
import { rotations } from '../../util/karesz';
import { spwn } from '$lib/util/command';
import { randstr } from '$lib/util';

export interface KareszDotnetOptions {
    code:string;
    karesz: {
        sizeX:number; 
        sizeY:number;   
        startX:number; 
        startY:number;
        startRotation:rotations;
        map:string;
    }
    limit?: {
        cpu_time:number;
        max_stack:number;
        max_ticks:number;
    }|undefined;
    use_stdbuf?:boolean|undefined;
}

export interface KareszFunctions {
    std:'in'|'out';
    cmd:string;
    match:{ x:RegExp, s?:RegExp|undefined }|RegExp;
}

export class KareszDotnet {

    private location:string;
    private readonly filename:string = 'Program';
    private options:KareszDotnetOptions;
    public karesz:Karesz;

    constructor(location:string='testing', options:KareszDotnetOptions={ code:'', karesz:{ sizeX:10, sizeY:10, startX:5, startY:5, startRotation:rotations.up, map:'' }, limit:{ max_stack:128 * 10_000, max_ticks:5000, cpu_time:2000 } }) {
        if(!fs.existsSync(location))
            fs.mkdirSync(location);
        this.location = path.join(location, randstr(20));
        fs.mkdirSync(this.location);
        this.options = options;
    }

    private async compile():Promise<void> {
        return new Promise<void>((res, rej) => {
            var err = '';
            spwn('mcs', `${this.filename}.cs`)
                .onError(e => err += e)
                .onExit((code, signal) => {
                    console.log(`EXIT ${code} - ${signal}`);    // DEBUG
                    if(code != 0)
                        rej(`Compile failed. Exit code is not 0.\n${err}`);
                    res();
                }).run({ cwd:this.location });
        });
    }
    
    private async precompile():Promise<void> {
        return new Promise<void>((res, rej) => {
            var err = '';
            spwn('mono', '--aot=full', `${this.filename}.exe`)
                .onError(e => err += e)
                .onExit((code, signal) => {
                    console.log(`EXIT ${code} - ${signal}`);    // DEBUG
                    if(code != 0)
                        rej(`Precompile failed. Exit code is not 0.\n${err}`);
                    res();
                }).run({ cwd:this.location });
        });
    }

    private prepare():void {
        this.options.code = new DotnetStrings().replaceKareszFunctions(this.options.code, BASE_CONFIG);
    }

    private parseLines (s:string, karesz:Karesz, write:(s:string)=>void):object|number|boolean {
        const lines = s.replaceAll('\r\n','\n').split('\n');
        for(const line in lines) {
            // split line to in/out : 'command'
            const [io, cmd] = lines[line].split(':').map(x => x.trim());
            // ignore debug logs
            if(!(io && cmd) || !(io == 'out' || io == 'in')) 
                continue;
            // parse and do command
            const result = parseCommand(cmd, karesz);
            if(result === undefined) continue;
            // handle karesz errors
            if(result['error']) 
                return { error: result['error'] };
            // write to stdin
            if(io == 'in') {
                console.log(`Writing to stdin: '${result}'`);  //DEBUG
                write(result.toString());
            }
        }
    }

    public async run():Promise<any> {
        return new Promise<any>(async (res, rej) => {
            this.prepare();
            if(this.options.code === undefined || this.options.code == '')
                rej(`Unable to compile code. Code is probably malformed.`);
            fs.writeFileSync(path.join(this.location, `${this.filename}.cs`), this.options.code);
            // create new karesz
            const karenv = new Kontext(this.options.karesz.sizeX, this.options.karesz.sizeY);
            if(this.options.karesz.map) karenv.load(this.options.karesz.map);
            const k = new Karesz({x:this.options.karesz.startX, y:this.options.karesz.startY}, this.options.karesz.startRotation);
            karenv.addKaresz(k);
            // compile
            await this.compile().catch(e => rej(e));
            await this.precompile().catch(e => rej(e));
            // run
            var ticksElapsed:number = 0;
            const startTime:number = Date.now();

            spwn('mono', `${this.filename}.exe`)
                .onData((data, write, kill) => {
                    if(++ticksElapsed > this.options.limit.max_ticks) {
                        kill('SIGKILL');
                        res({ results: { steps: k.steps, statistics: k.stats, exec_time:Date.now()-startTime, error:`Error: exceeded tick limit of ${this.options.limit.max_ticks} ticks.` }});
                    } 
                    // execute command
                    const result = this.parseLines(data.toString(), k, (s) => write(s));
                    if(result && result['error']) {
                        kill('SIGKILL');
                        res({ results: { steps: k.steps, statistics: k.stats, exec_time:Date.now()-startTime, error: result['error'] }});
                    }
                })
                // break on first error
                .onError(e => rej(e))
                .onExit((code, signal) => {
                    if(code != 0)
                        rej(`Exit code is not zero.`);
                    res({ results: { steps: k.steps, statistics: k.stats, exec_time:Date.now()-startTime }});
                })
                .run({ cwd:this.location, std:{ encoding:'utf-8', use_stdbuf:this.options.use_stdbuf } });
        });
    }
}

export class DotnetStrings {

    stdout:string;
    stdin:string;

    private functionsToInject = ():string =>
        `\npublic static bool ${this.stdin}(string c,string m){System.Console.WriteLine($"in:{c}");string v=System.Console.ReadLine();return v==m;}
        public static int ${this.stdin}(string c){System.Console.WriteLine($"in:{c}");string v=System.Console.ReadLine();return int.Parse(v);}
        public static void ${this.stdout}(string c){System.Console.WriteLine($"out:{c}");}\n`;
    
    constructor(){
        this.stdout = `_${randstr(30)}`;
        this.stdin = `_${randstr(30)}`;
    }

    /**
     * Replace function with extras: select a string from matched one that will be placed on :x:
     */
    private replaceX (s:string, match:RegExp, key:string, select?:RegExp|undefined):string {
        if(!select)
            select = this.sel;
        const r = s.match(match);
        if (!r) return s;
        r.map(x => {
            s = s.replaceAll(x, key.replaceAll(':x:', x.match(select)[0].trim()));
        });
        return s;
    }

    /**
     * Replace a series of strings/matches in a string
     */
    private replace(args:object, s:string):string {
        for(const key in args) 
            s = args[key].x ? this.replaceX(s, args[key].x, key, args[key].s) : s.replaceAll(args[key], key);
        return s;
    }

    /**
     * Insert a string to a string at a specific index
     */
    private insert = (s:string, toAdd:string, at:number):string =>
        [s.slice(0, at), toAdd, s.slice(at)].join('');

    // Regex capture for the content between two parenthesis
    readonly sel:RegExp = /(?<=\()(.*?)(?=\))/gm;

    public replaceKareszFunctions (str:string, config:Array<KareszFunctions>):string|undefined {
        const toReplace = FORM_REFORMAT;
        for(const key in config) 
            toReplace[`${config[key].std=='in'?this.stdin:this.stdout}(${config[key].cmd.includes('"')?config[key].cmd:`"${config[key].cmd}"`})`] = config[key].match;

        str = this.replace(toReplace, str);
        const match = /public\s+class\s+Program[\n\r\s]+\{/gm.exec(str);
        // Unable to locate Program class
        if(! match)
            return;
        // insert util functions to start of script
        return this.insert(str, this.functionsToInject(), str.indexOf(match[0]) + match[0].length);
    }
}

/**
 * These are the functions to replace
 * The three util functions:
 * int  | stdin(string command) -> writes command and receives and integer in stdin
 * bool | stdin(string command, string match) -> writes command and compares it with the match value
 * void | stdout(string command) -> simply writes command 
 * KEYS:  
 * - std:in/out -> use 'in' if you're expecting a return value
 * - cmd: the command that needs to be interpreted
 * - match: regular expression - all matches from the code will be replaced
 *     - x: if you have a value in code (for example 'Tegyél_le_egy_kavicsot(fekete)'), in the command you can specify :x: 
 *          to be the replaced with the value of the regular expression given in s (e.g. "place "+fekete)
 *     - s: select a string from base match. if omitted, it will select the value between the brackets
 */
export const BASE_CONFIG:Array<KareszFunctions> = [
    { std:'out', cmd:'step', match:/Lépj\s*\(\s*\)/gm },
    { std:'out', cmd:'turn 1', match: /Fordulj_jobbra\s*\(\s*\)/gm },
    { std:'out', cmd:'turn -1', match: /Fordulj_balra\s*\(\s*\)/gm },
    { std:'out', cmd:'turn -1', match: /Fordulj\s*\(\s*balra\s*\)/gm },
    { std:'out', cmd:'turn 1', match: /Fordulj\s*\(\s*jobbra\s*\)/gm },
    { std:'out', cmd:'pickup', match: /Vegyél_fel_egy_kavicsot\s*\(\s*\)/gm },
    { std:'out', cmd:'place', match: /Tegyél_le_egy_kavicsot\s*\(\s*\)/gm },
    { std:'out', cmd:'"place "+:x:', match: { x:/Tegyél_le_egy_kavicsot\s*\(.*\)/gm } },
    { std:'in', cmd:'"up","0"', match: /Északra_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'"down","2"', match: /Délre_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'"left","3"', match: /Keletre_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'"right","1"', match: /Nyugatra_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'look', match: /Merre_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'"isrock","true"', match: /Van_e_itt_kavics\s*\(\s*\)/gm },
    { std:'in', cmd:'under', match: /Mi_van_alattam\s*\(\s*\)/gm },
    { std:'in', cmd:'"wallahead","true"', match: /Van_e_előttem_fal\s*\(\s*\)/gm },
    { std:'in', cmd:'"outofbounds","true"', match: /Kilépek_e_a_pályáról\s*\(\s*\)/gm },
    { std:'out', cmd:'"turn"+:x:', match: { x: /Fordulj\s*\(.*\)/gm } },
];

/**
 * Base regular expressions to replace the Form namespace with Program, void FELADAT with void Main and restrict imports
 */
export const FORM_REFORMAT = {
    'public class Program': /public\s+partial\s+class\s+Form1\s+:\s+Form/gm,
    '\t\tstatic :x:':{ x:/.*[a-zA-Z]+\s+[a-zA-Z\_\u00C0-\u00ff]+\s*\(.*\)[\n\r\s]*\{/gm, s:/.*/gms },
    'void Main(string[] args)':/void\s+FELADAT\s*\(\.*\)/gm,
    '':/using(?!.*(Linq|Collections|System\;|Text|Threading).*).+/gm    // restrict imports
}
