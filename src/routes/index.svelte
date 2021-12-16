<script lang="ts">
	// import ErrorPage from '$lib/svelte-components/error.svelte';
	import { onMount } from 'svelte';
	import { kanvas } from '$lib/front/kanvas';
	import type { instruction } from '$lib/karesz/karesz-utils';
	export let canvas:HTMLCanvasElement;

	let k;
	let steps:instruction[] = [];
	let stats:object;
	let code_content:HTMLTextAreaElement;
	let playbackSpeedSlider:HTMLInputElement;

	onMount(() => {
		k = new kanvas(10, 10, canvas);
		k.kareszes.push({hidden:false, id:'asd', position:{x:5,y:5}, rotation:0});
		k.render();
		code_content.value = test_dotnet_code;

		playbackSpeedSlider.onchange = () => 
			k.setTickSpeed(playbackSpeedSlider.value);
	});

	const start = ():void => 
		k.play(SAMPLE_RESULTS, false, playbackSpeedSlider.value);
	
	const resume = ():void => 
		k.play(SAMPLE_RESULTS, true, playbackSpeedSlider.value);
	
	const pause = ():void => 
		k.stop();

	const reset = ():void => 
		k.reset();
	
	const SAMPLE_RESULTS = [{"command":"turn","value":1},{"command":"step","value":{"x":6,"y":5}},{"command":"step","value":{"x":7,"y":5}},{"command":"step","value":{"x":8,"y":5}},{"command":"step","value":{"x":9,"y":5}},{"command":"turn","value":0},{"command":"turn","value":3},{"command":"step","value":{"x":8,"y":5}},{"command":"step","value":{"x":7,"y":5}},{"command":"step","value":{"x":6,"y":5}},{"command":"step","value":{"x":5,"y":5}},{"command":"step","value":{"x":4,"y":5}},{"command":"step","value":{"x":3,"y":5}},{"command":"step","value":{"x":2,"y":5}},{"command":"step","value":{"x":1,"y":5}},{"command":"step","value":{"x":0,"y":5}}];

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
		const { results } = result.ok ? await result.json() : 'error';
		if(!results) return;
		console.log(results);
		stats = { exec_time: results.exec_time, ...results.statistics }
	}

</script>
<style>
	:global(html) {
		background-color: rgb(114, 114, 114) !important;
	}
</style>
<h1>Karezs</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<main>
	<div class="karesz-kontainer">
		<canvas bind:this="{canvas}"  width="300" height="300" id="main" class="karesz-kanvas"></canvas>
	</div>
	<div>
		<button on:click="{start}">Play</button>
		<button on:click="{pause}">Stop</button>
		<button on:click="{resume}">Resume</button>
		<button on:click="{reset}">Reset</button>
		<div><input type="range" min="1" max="1000" value="200" bind:this="{playbackSpeedSlider}"></div>
	</div>
	<div>
		<textarea bind:this="{code_content}" name="Code karesz here" rows="50" cols="100" id="code"></textarea>
	</div>
	<button on:click="{async() => await submitCode()}">submit</button>
</main>