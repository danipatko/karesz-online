import { spawn } from 'child_process';
import fs from 'fs';
import kontext from '../kontext';
import karesz from '../karesz';
import { replaceKareszFunctions, write } from './dotnet-strings';
import path from 'path/posix';
import { parseCommand } from '../karesz-standard';
import { rotations } from '../karesz-utils';

// DEBUG
const P = '/mnt/c/Users/Dani/home/Projects/karesz-online/testing/Program.cs';
const _P = '/mnt/c/Users/Dani/home/Projects/karesz-online/testing/Program.exe';

/**
 * Use mcs to compile .NET file
 * DEBUG NOTE: using WSL, root is /mnt/c/...
 */
export const compile = async(filename:string=P):Promise<any> => {
    return new Promise<any>((res, rej) => {
        const c = spawn('mcs', [filename]);
        // error handling
        c.on('error', (err:any) => rej(err));
        c.stderr.on('data', (err:any) => rej(err));
        c.stderr.on('error', (err:any) => rej(err));

        c.on('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}
/**
 * Precompile executable with mono
 */
export const precompile = async(filename:string=P) => {
    return new Promise<any>((res, rej) => {
        const c = spawn('mono', ['--aot=full', filename]);
        // error handling
        c.on('error', (err:any) => rej(err));
        c.stderr.on('data', (err:any) => rej(err));
        c.stderr.on('error', (err:any) => rej(err));
        
        c.on('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}
/**
 * Execute script (.exe)
 * @param filename path of the file to exec
 * @param datahandler callback function called on data recv
 * @param errorhandler callback function called on error recv
 */
export const run = async(mono:any, datahandler:any, errorhandler:any):Promise<any> => {
    return new Promise<any>((res, rej) => {
        // set std buffer and run with mono
        mono.stdin.setDefaultEncoding('utf-8');
        mono.stdout.pipe(process.stdout);

        mono.on('error', errorhandler);
        mono.stderr.on('data', errorhandler);
        mono.stderr.on('error', errorhandler);

        // C# Console.WriteLine uses this channel
        mono.stdout.on('data', (buf:Buffer) => datahandler(buf.toString()));

        mono.once('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}
// /mnt/c/Users/Dani/home
const TESTING_DIRECTORY_PATH = `/home/dapa/Projects/karesz-online/testing`;

export const tryrun = async({ sizeX=10, sizeY=10, startX=5, startY=5, startRotation=rotations.up, code='', map=undefined, filename='Program.cs', max_ticks=5_000, max_time=1000*2 }={}):Promise<any> => {
    return new Promise<any>(async res => {
        console.log(`STARTING FROM ${startX}:${startY} - ${startRotation}`);
        // create karesz
        const karenv = new kontext(sizeX, sizeY);
        if(map) karenv.load(map);
        // karenv.load(mapString);
        const k = new karesz({x:startX, y:startY}, startRotation);
        karenv.addKaresz(k);

        // get path for .cs and .exe
        const dotcs = path.join(TESTING_DIRECTORY_PATH, filename);
        const executable = path.join(TESTING_DIRECTORY_PATH, filename.replaceAll('.cs', '.exe'));
        // replace contents
        try {
            fs.writeFileSync(dotcs, replaceKareszFunctions(code) || 'Not found.');
        } catch (error) {
            res({ error:`Failed to save file.\n${error}` });
        }
        
        // compile .cs file to .exe
        await compile(dotcs).catch((err:any) => {
            res({ error:`An error occured while compiling: ${err}\nCommand: 'mcs ${dotcs}'` })
        });
        // precompile exe
        await precompile(executable).catch((err:any) => {
            res({ error:`An error occured performing ahead-of-time compile: ${err}\nCommand: 'mono --aot=full ${executable}'` });
        });
        
        var finished = false;
        // kill after reaching max time (ms)
        setTimeout(() => {
            if(!finished) mono.kill('SIGKILL');
            res({ results: { steps: k.steps, statistics: k.stats, exec_time:Date.now()-startTime, error: `Error: exceeded maximum time limit of ${max_time} ms.`} });
        }, max_time);
        
        const startTime = Date.now();
        const mono = spawn('stdbuf', ['-i0', '-o0', '-e0', 'mono', executable]);    // clear std
        var ticks = 0;  // track number of ticks
        const { /*exitcode, exitsignal,*/ error } = await run(mono,
        // handle incoming data
        (input:string) => {
            if(++ticks > max_ticks) {
                mono.kill('SIGKILL');
                res({ results: { steps: k.steps, statistics: k.stats, exec_time:Date.now()-startTime, error:`Error: exceeded tick limit of ${max_ticks} ticks.` } });
                return;
            } 
            // continue if undefined
            if(input === undefined) return;
            // execute command
            const result = parseInput(input, k, mono);
            // break on error
            if(result && result['error']) {
                mono.kill('SIGKILL');
                res({ results: { steps: k.steps, statistics: k.stats, exec_time:Date.now()-startTime, error: result['error'] } });
            }
        }, 
        // handle errors
        (e:any) => {
            res({ error:`Process ended with an error:\n'${e}'` });
        });

        finished = true;
        if(error)    // compile or runtime error
            res({ error });
        
        res({ results:{ steps: k.steps, statistics: k.stats, exec_time:Date.now()-startTime }});
    });
}

const parseInput = (input:string, karesz:karesz, mono:any):object|number|boolean => {
    var result:number|boolean|object|undefined;
    // replace crlf
    const split = input.replaceAll('\r\n','\n').split('\n');
    for(const line in split) {
        // split line to in/out : 'command'
        const [io, cmd] = split[line].split(':').map(x => x.trim());
        // ignore debug logs
        if(!(io && cmd) || !(io == 'out' || io == 'in')) 
            continue;
        // parse and do command
        result = parseCommand(cmd, karesz);
        if(result === undefined) continue;
        // handle karesz errors
        if(result['error']) 
            return { error: result['error'] };
        // write to stdin
        if(io == 'in') {
            console.log(`Writing to stdin: '${result}'`);  //DEBUG
            write(mono, result.toString());
        }
    }
}
