import { spawn } from 'child_process';
import { group_outros, xlink_attr } from 'svelte/internal';
import fs from 'fs';

const P = '/home/dapa/Projects/karesz-online/testing/Program.cs';
const _P = '/home/dapa/Projects/karesz-online/testing/Program.exe';

/**
 * Use mcs to compile .NET file
 * DEBUG NOTE: using WSL, root is /mnt/c/...
 */
export const compile = (filename:string=P):Promise<any> => {
    return new Promise<any>((res, rej) => {
        const c = spawn('mcs', [filename]);
        c.on('error', (err:any) => rej(err));
        c.on('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}

export const precompile = (filename:string=P) => {
    return new Promise<any>((res, rej) => {
        const c = spawn('mono', ['--aot=full', filename]);
        c.on('error', (err:any) => rej(err));
        c.on('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}

export const run = (filename:string=P, datahandler:Function, errorhandler:any) => {
    return new Promise<any>((res, rej) => {
        // set std buffer and run with mono
        const mono = spawn('stdbuf', ['-i0', '-o0', '-e0', 'mono', filename]);
        mono.stdin.setDefaultEncoding('utf-8');
        mono.stdout.pipe(process.stdout);

        mono.on('error', errorhandler);
        mono.stderr.on('data', errorhandler);
        mono.stderr.on('error', errorhandler);

        // C# Console.WriteLine uses this channel
        mono.stdout.on('data', (buf:Buffer) => datahandler(mono, buf.toString()));

        mono.once('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}

export const tryrun = async() => {
    // const rr = await run();
    //console.log(rr);

    fs.writeFileSync(P, replaceKareszFunctions(fs.readFileSync(P).toString()));

    // console.log(' (sadjvbfkl) '.match(sel)[0]);

    await compile(_P);
    await precompile(_P);
    await createSession(_P);

    console.log('exited');
}

const UTIL_FUNCTIONS_FOR_CSHARP = 
`
public static bool stdin(string command,string match){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return value==match;}
public static int stdin(string command){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return int.Parse(value);}
public static void stdout(string command){Console.WriteLine($"out:{command}");}
`;

const test = `
using System;
using System.Collections.Generic;
using System.Linq;

namespace Karesz
{
    public class Program
    {
        static void Main(string[] args)
        {
            Fordulj(1);
            Lépj();
            Fordulj_jobbra();
            Lépj();
            Lépj();
            Lépj();
            Tegyél_le_egy_kavicsot();
        }     
    }
}
`;

const riplace = (s:string, match:RegExp, key:string, select:RegExp) => {
    const r = match.exec(s);
    if (!r) return s;
    r.map(x => {
        s = s.replaceAll(x, key.replaceAll(':x:', x.match(select)[0]));
    });
    return s;
}

const replace = (args:object, s:string):string => {
    for(const key in args) 
        s = args[key].x ? riplace(s, args[key].x, key, args[key].s) : s.replaceAll(args[key], key);
    return s;
}

const insert = (s:string, toAdd:string, at:number):string => {
    return [s.slice(0, at), toAdd, s.slice(at)].join('');
}

const sel = /(?<=\()(.*?)(?=\))/gm;

export const replaceKareszFunctions = (str:string):string => {
    // Instert utility functions after 
    // 'public partial class Form1 : Form {'

    // RESET CONTENT - REMOVE THE LINE BELOW
    str = test;

    const match = /public\s+partial\s+class\s+Form1\s+:\s+Form[\n\r\s]+{/gm.exec(str) || /public\s+class\s+Program[\n\r\s]+{/gm.exec(str);
    // console.log(match);
    if(! match)
        return;

    console.log('GOT HERE');

    str = insert(str, UTIL_FUNCTIONS_FOR_CSHARP, str.indexOf(match[0]) + match[0].length);

    str = replace({
        'stdout("step")':/Lépj\s*\(\s*\)/gm,
        'stdout("turn 1")':/Fordulj_jobbra\s*\(\s*\)/gm,
        'stdout("turn -1")':/Fordulj_balra\s*\(\s*\)/gm,
        'stdout("pickup")':/Vegyél_fel_egy_kavicsot\s*\(\s*\)/gm,
        'stdout("place")':/Tegyél_le_egy_kavicsot\s*\(\s*\)/gm,
        'stdout("place "+:x:)':{ x:/Tegyél_le_egy_kavicsot\s*\(.*\)/gm, s:sel },
        'stdin("up","0")':/Északra_néz\s*\(\s*\)/gm,
        'stdin("down","2")':/Délre_néz\s*\(\s*\)/gm,
        'stdin("left","3")':/Keletre_néz\s*\(\s*\)/gm,
        'stdin("right","1")':/Nyugatra_néz\s*\(\s*\)/gm,
        'stdin("look")':/Merre_néz\s*\(\s*\)/gm,
        'stdin("isrock","true")':/Van_e_itt_kavics\s*\(\s*\)/gm,
        'stdin("under")':/Mi_van_alattam\s*\(\s*\)/gm,
        'stdin("wallahead","true")':/Van_e_előttem_fal\s*\(\s*\)/gm,
        'stdin("outofbounds","true")':/Kilépek_e_a_pályáról\s*\(\s*\)/gm,
        'stdout("turn "+:x:)':{ x: /Fordulj\s*\(\d*\)/gm, s:sel },
    }, str); 

    console.log(str);
    return str;
}

import { karesz } from './karesz-ss';
import { parseCommand } from './karesz-standard';

const write = (mono:any, data:string) => {
    if(! mono.stdin.writable) return;
    // these 3 commands are necessary for std inputs
    mono.stdin.cork();
    mono.stdin.write(`${data}\n`);
    mono.stdin.uncork();
}

export const createSession = async(filename:string, { sizeY=10, sizeX=10, startingPoint={x:0,y:0}, startRotation=0 }={}) => {
    const k = new karesz(startingPoint, startRotation, (e:any) => {
        console.log(e);
    }, sizeX, sizeY);

    await run(filename, (mono:any, input:string) => {
        const [ IO, line ] = input.split(':');

        console.log(`stdout received: ${IO} >> '${line}'`);

        const result = parseCommand(line, k);
        
        console.log(result);
        k.status();

        if(IO == 'in' && result) 
            write(mono, result.toString());
    }, 
    (e:any) => console.log(`ERROR: ${e}`));

    console.log(k.steps);
}

