<script lang="ts">
	// import ErrorPage from '$lib/svelte-components/error.svelte';
	import { onMount } from 'svelte';
	import { kanvas } from '$lib/front/kanvas';
	export let data:object;
	export let canvas:HTMLCanvasElement;
	  
	onMount(() => {
		/*console.log('INNIT');
		const k = new kanvas(10, 10, canvas);
		k.add({x:3,y:3}, 'square', '#f00', 'wall');
		k.add({x:2,y:2}, 'circle', '#ff0', 'rock');
		k.add({x:3,y:3}, 'svg', 'http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg', 'asd');
		k.render();*/

		code_content.value = test_dotnet_code;
	});

	var code_content:HTMLTextAreaElement;

	/**/
	const test_dotnet_code = `using System;
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

	//*/

	const submitCode = async():Promise<void> => {
		const result = await fetch(`/run/dotnet`, {
			body: JSON.stringify({
				code:code_content.value, 
				kareszconfig:{ sizeX:10, sizeY: 10, startX: 5, startY:5 }
			}),
			method:'post',
		});
		const a = result.ok ? await result.json() : 'error';
		console.log(a);
		return a;
	}

</script>
<style>
	:global(html) {
		background-color: rgb(32, 32, 32) !important;
	}
</style>
<h1>Karezs</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
  
<!-- PROJECT FOUND  -->
<p>{JSON.stringify(data)}</p>
  
<main>
	<div class="karesz-kontainer">
		<canvas bind:this="{canvas}"  width="300" height="300" id="main" class="karesz-kanvas"></canvas>
	</div>
	<div>
		<textarea bind:this="{code_content}" name="Code karesz here" id="code" on:click="{async() => await submitCode()}">
			
		</textarea>
	</div>
</main>