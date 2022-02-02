import fs from 'fs';
import Kontext from '../old/kontext';
import Karesz from '../old/karesz';
import path from 'path/posix';
import { rotations } from '../../util/karesz';
import { spwn } from '$lib/util/command';
import { randstr } from '$lib/karesz/util';

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
                    // console.log(`EXIT ${code} - ${signal}`);    // DEBUG
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
                    // console.log(`EXIT ${code} - ${signal}`);    // DEBUG
                    if(code != 0)
                        rej(`Precompile failed. Exit code is not 0.\n${err}`);
                    res();
                }).run({ cwd:this.location });
        });
    }

    private prepare():void {
        
    }

    private logs:string = '';   // logs created by user

    private parseLines (s:string, karesz:Karesz, write:(s:string)=>void):object|number|boolean {
        const lines = s.replaceAll('\r\n','\n').split('\n');
        for(const line in lines) {
            const [io, cmd] = lines[line].split(':').map(x => x.trim());
            if(!(io && cmd) || !(io == 'out' || io == 'in')) { if(lines[line] != '' && lines[line] != '\n') this.logs += `${lines[line]}\n`; continue };  // ignore logs
            const result = karesz.parseExec(cmd);
            if(result === undefined) continue;
            if(result['error']) return { error: result['error'] };
            if(io == 'in')
                write(result.toString());
        }
    }

    public async runRemove():Promise<any> {
        const r = await this.run();
        fs.rmSync(this.location, { recursive:true });
        return r;
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
            await this.compile()
                .catch(e => rej(e));
            await this.precompile()
                .catch(e => rej(e));
            // run
            var ticksElapsed:number = 0;
            const startTime:number = Date.now();

            spwn('mono', `${this.filename}.exe`)
                .onData((data, write, kill) => {
                    if(++ticksElapsed > this.options.limit.max_ticks) {
                        kill('SIGKILL');
                        res({ results: { steps: k.getSteps(), logs:this.logs, exec_time:Date.now()-startTime, error:`Error: exceeded tick limit of ${this.options.limit.max_ticks} ticks.` }});
                    } 
                    // execute command
                    const result = this.parseLines(data.toString(), k, (s) => write(s));
                    if(result && result['error']) {
                        kill('SIGKILL');
                        res({ results: { steps: k.getSteps(), logs:this.logs, exec_time:Date.now()-startTime, error: result['error'] }});
                    }
                })
                // break on first error
                .onError(e => rej(e))
                .onExit((code, signal) => {
                    if(code != 0)
                        rej(`Exit code is not zero.`);
                    res({ results: { steps: k.getSteps(), logs:this.logs, exec_time:Date.now()-startTime }});
                })
                .run({ cwd:this.location, std:{ encoding:'utf-8' } });
        });
    }
}

