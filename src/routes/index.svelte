<script lang="ts">
	import { onMount } from 'svelte';
	import { kanvas } from '$lib/front/kanvas';
	import type { instruction } from '$lib/karesz/karesz-utils';
	import { currentCommandIndex } from '$lib/svelte-components/store';
	import Command from '$lib/svelte-components/command.svelte';
	import { commandStore } from '$lib/svelte-components/store';
	import { sampleCommands, sampleCode } from '$lib/tmp';

	let canvas:HTMLCanvasElement;
	let k:kanvas;
	let CURRENT_STEPS_PARSED:instruction[] = [];
	let CURRENT_STATISTICS:object;
	let EDITOR:HTMLTextAreaElement;
	let PLAYBACK_SPEED_SLIDER:HTMLInputElement;
	
	// window.onload
	onMount(() => {
		// create new karesz canvas, fill default editor and test instuctions
		k = new kanvas(10, 10, canvas);
		k.kareszes.push({hidden:false, id:'asd', position:{x:5,y:5}, rotation:0});
		k.render();
		// set up test env
		EDITOR.value = sampleCode;
		parseCommands(sampleCommands);
		// dynamically set tick speed 
		PLAYBACK_SPEED_SLIDER.oninput = () => 
			k.setTickSpeed(parseInt(PLAYBACK_SPEED_SLIDER.value));
		// subscribe to index change event
		currentCommandIndex.subscribe(index => {
			if(index != -1) k.jumpToStep(CURRENT_STEPS_PARSED, index);
		});
	});

	// wrapper for events
	const startStop = ():Promise<void> => 
		k.play(CURRENT_STEPS_PARSED, true, parseInt(PLAYBACK_SPEED_SLIDER.value));
	
	// wrapper for events
	const reset = ():void => 
		k.reset();

	// parse string commands to an array of instructions (global => CURRENT_STEPS_PARSED)
	const parseCommands = (commands:string):void => {
		CURRENT_STEPS_PARSED = k.parseCommands(commands);
		listCommands(CURRENT_STEPS_PARSED);
	}

	// send code to server
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

	// populate $commandStore 
	const listCommands = (commands: instruction[]) => {
		for (let i = 0; i < commands.length; i++) 
			$commandStore[i] = { index:i, command:commands[i].command, value:commands[i].value };
	}

</script>
<style>
	:global(html) {
		background-color: rgb(31, 31, 31) !important;
	}
</style>
<h1>Karezs</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<main>
	<div class="karesz-kontainer">
		<canvas bind:this="{canvas}"  width="300" height="300" id="main" class="karesz-kanvas"></canvas>
	</div>
	<div>
		<button on:click="{startStop}">Play/Stop</button>
		<button on:click="{reset}">Reset</button>
		<div><input type="range" min="1" max="1000" value="200" bind:this="{PLAYBACK_SPEED_SLIDER}"></div>
	</div>
	<div>
		<textarea bind:this="{EDITOR}" name="Code karesz here" rows="50" cols="100" id="code"></textarea>
	</div>
	<button on:click="{async() => await submitCode()}">submit</button>
	<br>
	<div>
		<ul>	
			{#each $commandStore as item}
				<li><svelte:component this={Command} index={item['index']} command={item['command']} value={item['value']}/></li>
			{/each}
		</ul>
	</div>
</main>