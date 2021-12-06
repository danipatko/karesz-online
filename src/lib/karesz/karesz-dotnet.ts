import { spawn } from 'child_process';
import fs from 'fs';

const P = '/mnt/c/Users/Dani/home/Projects/karesz-online/testing/Program.cs';
const _P = '/mnt/c/Users/Dani/home/Projects/karesz-online/testing/Program.exe';

/**
 * Use mcs to compile .NET file
 * DEBUG NOTE: using WSL, root is /mnt/c/...
 */
export const compile = (filename:string=P):Promise<any> => {
    return new Promise<any>((res, rej) => {
        const c = spawn('mcs', [filename]);
        // error handling
        c.on('error', (err:any) => rej(err));
        c.stderr.on('data', (err:any) => rej(err));
        c.stderr.on('error', (err:any) => rej(err));

        c.on('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}

export const precompile = (filename:string=P) => {
    return new Promise<any>((res, rej) => {
        const c = spawn('mono', ['--aot=full', filename]);
        // error handling
        c.on('error', (err:any) => rej(err));
        c.stderr.on('data', (err:any) => rej(err));
        c.stderr.on('error', (err:any) => rej(err));
        
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
    // prepare .cs file for compilation and execution
    const contents = fs.readFileSync(P).toString();
    fs.writeFileSync(P, replaceKareszFunctions(contents) || 'Bruh');

    await compile(P).catch((err:any) => {
        console.log(`An error occured while compiling: ${err}\nCommand: 'mcs ${P}'`);
        return;
    });
    
    await precompile(_P).catch((err:any) => {
        console.log(`An error occured performing ahead-of-time compile: ${err}\nCommand: 'mono --aot=full ${_P}'`);
        return;
    })

    await runSession(_P);

    console.log('Done!');
}

const UTIL_FUNCTIONS_FOR_CSHARP = 
`
\t\tpublic static bool stdin(string command,string match){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return value==match;}
\t\tpublic static int stdin(string command){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return int.Parse(value);}
\t\tpublic static void stdout(string command){Console.WriteLine($"out:{command}");}
`;

const _test = `
using System;
using System.Collections.Generic;
using System.Linq;

namespace Karesz
{
    public class Program
    {
        void Main(string[] args)
        {
            Console.WriteLine("in:wallahead");
            string r = Console.ReadLine();
            Console.WriteLine("Recvd: "+r);
        }     
    }
}
`;

const test = `
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;
using System.Threading;

namespace Karesz
{
    public partial class Form1 : Form
    {
        void Fordulj_meg()
        {
            Fordulj(balra);
            Fordulj(balra);
        }

        void menj_a_falig()
        {
            while (!Van_e_előttem_fal())
            {
                Lépj();
            }
        }

        bool Tudok_e_lépni()
        {
            return (!Van_e_előttem_fal() && !Kilépek_e_a_pályáról());
        }

        void FELADAT()
        {
            Fordulj(jobbra);
            while(Tudok_e_lépni()) {
                Lépj();
            }
            Fordulj_meg();
            while(Tudok_e_lépni()) {
                Lépj();
            }
        }
    }
}
`;

/**
 * Replace function with extras: select a string from matched one that will be placed on :x:
 * @param s the base string
 * @param match primary match
 * @param key string to replace match with
 * @param select string to replace :x: with
 * @returns replaced string
 */
const riplace = (s:string, match:RegExp, key:string, select:RegExp) => {
    const r = s.match(match);
    if (!r) return s;
    
    r.map(x => {
        s = s.replaceAll(x, key.replaceAll(':x:', x.match(select)[0].trim()));
    });
    return s;
}

/**
 * Replace a series of strings/matches in a string
 * @returns {string} replaced string
 */
const replace = (args:object, s:string):string => {
    for(const key in args) 
        s = args[key].x ? riplace(s, args[key].x, key, args[key].s) : s.replaceAll(args[key], key);
    return s;
}

/**
 * Insert a string to a string at a specific index
 */
const insert = (s:string, toAdd:string, at:number):string => 
    [s.slice(0, at), toAdd, s.slice(at)].join('');

// Regex capture for the content between two parenthesis
const sel = /(?<=\()(.*?)(?=\))/gm;

export const replaceKareszFunctions = (str:string):string => {
    // Instert utility functions after 
    // 'public partial class Form1 : Form {'

    // RESET CONTENT - REMOVE THE LINE BELOW
    str = test;

    str = replace({
        'public class Program': /public\s+partial\s+class\s+Form1\s+:\s+Form/gm,
        'stdout("step")':/Lépj\s*\(\s*\)/gm,
        'stdout("turn 1")':/Fordulj_jobbra\s*\(\s*\)/gm,
        'stdout("turn -1")':/Fordulj_balra\s*\(\s*\)/gm,
        ' stdout("turn -1")':/Fordulj\s*\(\s*balra\s*\)/gm,
        ' stdout("turn 1")':/Fordulj\s*\(\s*jobbra\s*\)/gm,
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
        'stdout("turn "+:x:)':{ x: /Fordulj\s*\(.*\)/gm, s:sel }, 
        '\t\tstatic :x:':{ x:/.*[a-zA-Z]+\s+[a-zA-Z\_\u00C0-\u00ff]+\s*\(.*\)[\n\r\s]*\{/gm, s:/.*/gms },
        'void Main(string[] args)':/void\s+FELADAT\s*\(\s*\)/gm,
        '':/^\s*using(?!.*(Linq|Collections|System\;|Text|Threading).*).+/gm,
    }, str); 

    const match = /public\s+class\s+Program[\n\r\s]+\{/gm.exec(str);
    // Unable to locate Program
    if(! match)
        return;

    // insert util functions to start of script
    return insert(str, UTIL_FUNCTIONS_FOR_CSHARP, str.indexOf(match[0]) + match[0].length);
}

import { instruction, karesz } from './karesz-ss';
import { parseCommand } from './karesz-standard';

/**
 * Write a string to the stdin of a child process
 * @param mono the child process to write to
 * @param data writeable string
 */
const write = (mono:any, data:string) => {
    if(! mono.stdin.writable) return;
    // these 3 commands are necessary for std inputs
    mono.stdin.cork();
    mono.stdin.write(`${data}\n`);
    mono.stdin.uncork();
}

/**
 * Create a base karesz object and prepare a dotnet script and try to execute it 
 */
export const runSession = async(filename:string, { sizeY=10, sizeX=10, startingPoint={x:0,y:0}, startRotation=0 }={}):Promise<instruction[]> => {
    const k = new karesz(startingPoint, startRotation, sizeX, sizeY);
    const maxSteps = 5000;
    const maxTime = Date.now() + 1000*60*2; // maximal two minutes 

    let steps = 0;
    await run(filename, (mono:any, input:string) => {
        // input may be one or more lines
        const lines = input.split('\n');
        if(steps > maxSteps || maxTime < Date.now()) {
            mono.kill('SIGKILL');
            return;
        } 

        if(input === undefined) return;
        
        var line:Array<string>;
        var result:number|boolean;
        for (let i = 0; i < lines.length; i++) {
            // Split line to 'out' or 'in' and value
            line = lines[i].split(':');

            // skip undefined, or irrevelant logs
            if(line[1] === undefined || !(line[0] == 'out' || line[0] == 'in')) 
                continue;
            
            // parse command and update karesz 
            result = parseCommand(line[1], k);
            console.log(`parseCommand (${line[1]}) --> ${result}`);   //DEBUG

            steps++;
            // k.status(); //DEBUG

            if(result !== undefined && result['error']){
                console.log(`Karesz warning: '${result['error']}'`);  //DEBUG
                k.steps.push({ command:'ERROR', value:result['error'] });
                break;
            }

            if(line[0] == 'in' && result !== undefined) {
                console.log('Writing...');  //DEBUG
                write(mono, result.toString());
                break;
            }
        }
    }, 
    (e:any) => console.log(`ERROR: ${e}`));

    console.log('--- Steps done ---');  //DEBUG
    console.log(k.steps);   //DEBUG

    return k.steps;
}

