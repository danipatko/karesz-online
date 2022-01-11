// import { init } from '$lib/db/dbinit';
import { KareszDotnet } from '$lib/karesz/dotnet/karesz-dotnet';
import { Command, spwn } from '$lib/util/command';

const code = `using System;
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
}`;

const karesz = {"sizeX":20,"sizeY":20,"startX":10,"startY":10,"startRotation":0,"map":"00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000\n00000000000000000000"};
// const { results, error } = await new KareszDotnet('testing', { code, karesz, use_stdbuf:true, limit:{ max_ticks:5000, cpu_time:5, max_stack:128_000_000 } }).run();
// console.log(results);
// console.log(error);

new Command('mono', 'Program.exe')
.run({ cwd:'/mnt/c/Users/Dani/home/Projects/karesz-online/testing' })
.onData((data, write, kill) => {
	console.log(data.toString());
	if(data.toString().includes('in>'))
		write('balls');
})
.onError((e) => console.log(e))
.onExit((c) => {
	console.log(`Exited ${c}`);
})

// INITIALIZE db
// await init();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	return await resolve(request);
}
