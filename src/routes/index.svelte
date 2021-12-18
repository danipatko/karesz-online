<script lang="ts">
	// import ErrorPage from '$lib/svelte-components/error.svelte';
	import { onMount } from 'svelte';
	import { kanvas } from '$lib/front/kanvas';
	import type { instruction } from '$lib/karesz/karesz-utils';
	let canvas:HTMLCanvasElement;
	let k:kanvas;
	let CURRENT_STEPS_PARSED:instruction[] = [];
	let CURRENT_STATISTICS:object;
	let EDITOR:HTMLTextAreaElement;
	let PLAYBACK_SPEED_SLIDER:HTMLInputElement;

	onMount(() => {
		k = new kanvas(10, 10, canvas);
		k.kareszes.push({hidden:false, id:'asd', position:{x:5,y:5}, rotation:0});
		k.render();
		EDITOR.value = test_dotnet_code;

		PLAYBACK_SPEED_SLIDER.oninput = () => 
			k.setTickSpeed(parseInt(PLAYBACK_SPEED_SLIDER.value));

		$commandStore = [{ index:0, command:'r', value:1 }];
	});

	const start = ():Promise<void> => 
		k.play(k.parseCommands(SAMPLE_RESULTS) || CURRENT_STEPS_PARSED, false, parseInt(PLAYBACK_SPEED_SLIDER.value));
	
	const resume = ():Promise<void> => 
		k.play(k.parseCommands(SAMPLE_RESULTS) || CURRENT_STEPS_PARSED, true, parseInt(PLAYBACK_SPEED_SLIDER.value));
	
	const pause = ():void => 
		k.stop();

	const reset = ():void => 
		k.reset();
	
	const SAMPLE_RESULTS = 'r=1,m=6:5,m=7:5,m=8:5,m=9:5,r=0,r=3,m=8:5,m=7:5,m=6:5,m=5:5,m=4:5,m=3:5,m=2:5,m=1:5,m=0:5';

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
			Tegyél_le_egy_kavicsot(fekete);
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
				code:EDITOR.value, 
				kareszconfig:{ sizeX:10, sizeY: 10, startX: 5, startY:5 }
			}),
			method:'post',
		});
		const { results } = result.ok ? await result.json() : 'error';
		if(!results) return;
		CURRENT_STEPS_PARSED = k.parseCommands(results.steps);
		CURRENT_STATISTICS = { exec_time: results.exec_time, ...results.statistics }
	}

	import Command from '$lib/svelte-components/command.svelte';
	import { commandStore } from '$lib/svelte-components/store';

	const listOfCommands = () => {
		const arr = k.parseCommands(SAMPLE_RESULTS);
		console.log(arr);
		for (let i = 0; i < arr.length; i++) {
			$commandStore[i] = { index:i+1, command:arr[i].command, value:arr[i].value };
		}
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
		<div><input type="range" min="1" max="1000" value="200" bind:this="{PLAYBACK_SPEED_SLIDER}"></div>
	</div>
	<div>
		<textarea bind:this="{EDITOR}" name="Code karesz here" rows="50" cols="100" id="code"></textarea>
	</div>
	<button on:click="{async() => await submitCode()}">submit</button>
	<br>
	<button on:click="{listOfCommands}">Add dynamic compontent</button>
	<div>
		<ul>	
			{#each $commandStore as item}
				<li><svelte:component this={Command} index={item['index']} command={item['command']} value={item['value']}/></li>
			{/each}
		</ul>
	</div>
</main>