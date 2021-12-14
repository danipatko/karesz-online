import { spawn } from 'child_process';
import fs from 'fs';
import kontext from '../kontext';
import karesz from '../karesz';
import { replaceKareszFunctions, write } from './dotnet-strings';
import path from 'path/posix';
import { parseCommand } from '../karesz-standard';

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
        mono.stdout.on('data', (buf:Buffer) => datahandler(mono, buf.toString()));

        mono.once('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}

const TESTING_DIRECTORY_PATH = `/mnt/c/Users/Dani/home/Projects/karesz-online/testing`;

export const tryrun = async({ sizeX=10, sizeY=10, startX=5, startY=5, code='', filename='Program.cs', max_ticks=5000, max_time=1000*60 }={}):Promise<void> => {
    return new Promise<any>(async res => {
        // create karesz
        const karenv = new kontext(sizeX, sizeY);
        const k = new karesz({x:startX, y:startY});
        karenv.addKaresz(k);
/*
        // get path for .cs and .exe
        const dotcs = path.join(TESTING_DIRECTORY_PATH, filename);
        const executable = path.join(TESTING_DIRECTORY_PATH, filename.replaceAll('.cs', '.exe'));
        // replace contents
        fs.writeFileSync(dotcs, replaceKareszFunctions(code) || 'Not found.');
        
        // compile .cs file to .exe
        await compile(dotcs).catch((err:any) => {
            res({error:`An error occured while compiling: ${err}\nCommand: 'mcs ${dotcs}'`})
        });
        // precompile exe
        await precompile(executable).catch((err:any) => {
            res({error:`An error occured performing ahead-of-time compile: ${err}\nCommand: 'mono --aot=full ${_P}'`});
        });
        // prepare run
        var finished = false;
        const mono = spawn('stdbuf', ['-i0', '-o0', '-e0', 'mono', filename]);

        await run(executable,
        // handle incoming data
        (mono:any, input:string) => {
            // track ticks
            var ticks;
            if(ticks > max_ticks) {
                mono.kill('SIGKILL');
                res({error:`Exceeded tick limit of ${max_ticks} ticks.`});
                return;
            } 
            // continue if undefined
            if(input === undefined) return;
            // execute command
            parseInput(input, k, mono);
        }, 
        // handle errors
        (e:any) => {
            res({error:`Process ended with an error:\n'${e}'`})
        });

        // kill after reaching max time (ms)
        setTimeout(() => {
            if(!finished) mono.kill('SIGKILL');
        }, max_time);*/

        res(0);

        console.log('Done!');
    });
}

const parseInput = (input:string, karesz:karesz, mono:any):object|number|boolean => {
    // replace crlf
    var line:Array<string>;
    var result:number|boolean;
    for(const i in input.replaceAll('\r\n','\n').split('\n')) {
        // split line to in/out : 'command'
        const [io, cmd] = input[i].split(':').map(x => x.replaceAll(/\s+/g,''));
        // ignore debug logs
        if(!(io && cmd) || !(io == 'out' || io == 'in')) 
            continue;
        // parse and do command
        result = parseCommand(cmd, karesz);
        // handle karesz errors
        if(result !== undefined && result['error']) {
            return { error: result['error'] };
        }
        // write to stdin
        if(io == 'in' && result !== undefined) {
            console.log(`Writing to stdin: '${result}'`);  //DEBUG
            write(mono, result.toString());
        }
    }
}


// DEBUG
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