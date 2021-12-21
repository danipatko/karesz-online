<script lang="ts">
	import '../app.css';
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
		adjustOnResize(false);
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

		document.body.classList.add('dark');
	});

	window.onresize = () => adjustOnResize();

	const adjustOnResize = (render:boolean=true):void => {
		// the canvas
		const container = document.getElementById('karesz-kontainer');
		canvas.width = container.clientWidth - 1;
		canvas.height = container.clientHeight - 1;
		if(render) k.render();
	}

	// wrapper for events
	const startStop = (button:any):void =>{ 
		k.play(CURRENT_STEPS_PARSED, true, parseInt(PLAYBACK_SPEED_SLIDER.value));
		button.classList.remove(k.running ? 'button-start' : 'button-stop');
		button.classList.add(k.running ? 'button-stop' : 'button-start');
		button.innerText = k.running ? ' STOP ' : 'START';
	}
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

<!-- settings: speed, grid size, reset -->

<main class="dark:bg-darkgray">
	<div class="grid grid-cols-2 gap-4">
		<!-- Karesz section -->
		<div class="grid grid-cols-3 gap-4">
			<div id="karesz-kontainer" class="karesz-kontainer col-span-2">
				<canvas bind:this="{canvas}"  width="300" height="300" id="main" class="karesz-kanvas">Your browser doesn't support canvas bruh.</canvas>
			</div>
			<div class="result-container">
				<div class="statistics-container">
					<!-- stats -->
				</div>
				<div class="karesz-kommand-kontainer overflow-y-scroll max-h-screen col-span-1">
					<!-- command list -->
					{#each $commandStore as item}
						<svelte:component this={Command} index={item['index']} command={item['command']} value={item['value']}/>
					{/each}
				</div>
			</div>
		</div>
		<!-- Editor section -->
		<div class="">
			<!-- <iframe width="800" height="1000" title="VSCode web" src="https://vscode.dev/" frameborder="0"></iframe>
			<div class="karesz-settings">
				 CONTROLS 
				<div class="mb-2 border-b p-1 border-zinc-600 text-zinc-600 text-sm">controls</div>
				<div class="karesz-control-bar">
					<button class="button-start font-bold dark:text-white" on:click="{(e) => startStop(e.target)}">START</button>
					<button class="button-stop font-bold dark:text-white" on:click="{reset}">RESET</button>
				</div>
				<div class="karesz-settings-container">
					<div><input type="range" min="1" max="1000" value="200" bind:this="{PLAYBACK_SPEED_SLIDER}"></div>
				</div>
			</div>
			
			--> </div>
	</div>
	<div>
		<div class="karesz-control-bar">
			<button class="button-start font-bold dark:text-white" on:click="{(e) => startStop(e.target)}">START</button>
			<button class="button-stop font-bold dark:text-white" on:click="{reset}">RESET</button>
		</div>
		<div class="karesz-settings-container">
			<div><input type="range" min="1" max="1000" value="200" bind:this="{PLAYBACK_SPEED_SLIDER}"></div>
		</div>
	</div>
</main>

<h1>Karezs</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<main class="dark:bg-darkgray">
	
	<div>
		<textarea class="bg-zinc-900" bind:this="{EDITOR}" name="Code karesz here" rows="50" cols="100" id="code"></textarea>
	</div>
	<button on:click="{async() => await submitCode()}">submit</button>
	<br>
	
</main>