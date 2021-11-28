import { spawn } from 'child_process';


/**
 * Use mcs to compile .NET file
 * DEBUG NOTE: using WSL, root is /mnt/c/...
 */
export const compile = (filename:string='/mnt/c/Users/Dani/home/Projects/karesz-online/testing/Program.cs'):Promise<any> => {
    return new Promise<any>((res, rej) => {
        const c = spawn('mcs', [filename]);
        c.on('error', (err:any) => rej(err));
        c.on('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}

export const precompile = (filename:string='/mnt/c/Users/Dani/home/Projects/karesz-online/testing/Program.exe') => {
    return new Promise<any>((res, rej) => {
        const c = spawn('mono', ['--aot=full', filename]);
        c.on('error', (err:any) => rej(err));
        c.on('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}

export const run = (filename:string='/mnt/c/Users/Dani/home/Projects/karesz-online/testing/Program.exe') => {
    return new Promise<any>((res, rej) => {
        // set std buffer and run with mono
        const mono = spawn('stdbuf', ['-i0', '-o0', '-e0', 'mono', filename]);
        mono.stdin.setDefaultEncoding('utf-8');
        mono.stdout.pipe(process.stdout);

        mono.on('error', (err:any) => console.log(err));

        // C# Console.WriteLine uses this channel
        mono.stdout.on('data', (buf:Buffer) => {
            const data = buf.toString();
            if(data.endsWith('in:\n') && mono.stdin.writable){
                // these 3 commands are necessary for std inputs
                mono.stdin.cork();
                mono.stdin.write('a\n');
                mono.stdin.uncork();
            }
        });

        mono.on('message', (data:Buffer) => {
            console.log(`message: ${data}`);
        });

        mono.once('exit', (code, signal) => res({ code:code, signal:signal }));
    });
}

export const tryrun = async() => {
    // const rr = await run();
    //console.log(rr);

    replaceKareszFunctions();

    console.log('exited');
}

const UTIL_FUNCTIONS_FOR_CSHARP = 
`public static bool stdin(string command, string match){Console.WriteLine($"in:{command}");string value = Console.ReadLine();return value == match;}
public static void stdout(string command) {Console.WriteLine($"out:{command}");}`;

const test = `using System;
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
        bool Tudok_e_menni()
        {
            return !Van_e_előttem_fal() && !Kilépek_e_a_pályáról();
        }
        void MenyjAmígTudsz_ésKavics()
        { 
            while(Tudok_e_menni())
            {
                Lépj();
                if(Van_e_itt_kavics())
                {
                    Vegyél_fel_egy_kavicsot();
                    kavicsok++;
                }
            }
        }
        void goRightUp()
        {
            MenyjAmígTudsz_ésKavics();
            Fordulj_balra();
            MenyjAmígTudsz_ésKavics();
            Fordulj(2);
        }
        int kavicsok = 0;
        void FELADAT()
        {
            
            bool fut = true;
            int irány = 1;
            goRightUp();
            while (fut)
            {
                MenyjAmígTudsz_ésKavics();
                Fordulj(irány);
                if(!Tudok_e_menni())
                {
                    fut = false;
                }
                else
                {
                    Lépj();
                    if (Van_e_itt_kavics())
                    {
                        Vegyél_fel_egy_kavicsot();
                        kavicsok++;
                    }
                    Fordulj(irány);
                }

                if(irány == 1)
                {
                    irány = -1;
                }
                else
                {
                    irány = 1;
                }
            }
            MessageBox.Show(Convert.ToString(kavicsok) + " kavicsot tudtam felszedni");
        }     
    }
}
`;

const replace = (regex:RegExp, v:string) => {
    const match = regex.exec(v);
    if(!match)  return;

    match.forEach(x => {
        console.log(x);
    });
}

export const replaceKareszFunctions = (filename:string='/mnt/c/Users/Dani/home/Projects/karesz-online/testing/Program.exe') => {
    
    // Instert utility functions after 
    // 'public partial class Form1 : Form {'
    
    const match = /public\s*partial\s*class\s*Form1\s*:\s*Form[\n\r\s]+{/gm.exec(test);
    if(! match)
        return false;
    const index = (test.indexOf(match[0]) + match[0].length);

    
}