<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { kanvas } from '$lib/front/kanvas';
	import { fields, instruction, point, rotations } from '$lib/karesz/karesz-utils';
	import { currentCommandIndex } from '$lib/svelte-components/store';
	import Command from '$lib/svelte-components/command.svelte';
	import { commandStore } from '$lib/svelte-components/store';
	import { sampleCommands, sampleCode } from '$lib/tmp';

	let canvas:HTMLCanvasElement;
	let k:kanvas;
	let CURRENT_STEPS_PARSED:instruction[] = [];
	let CURRENT_STATISTICS:object;
	let EDITOR:HTMLTextAreaElement;
	let SELECTED_FIELD:fields = fields.null;
	let startStopButton:HTMLButtonElement;
	export let STARTING_POINT:point = {x:5, y:5};
	export let STARTING_ROTATION = 0;
	export let STEP_INDEX = 0;
	export let RUNNING_STATE = 0;
	export let PLAYBACK_SPEED = 200;
	export let CURRENT_POSITION:string;
	export let CURRENT_ROTATION:number;

	import * as monaco from 'monaco-editor';

	// window.onload
	onMount(() => {
		adjustOnResize(false);
		// create new karesz canvas, fill default editor and test instuctions
		k = new kanvas(10, 10, canvas, (p, r, i, running) => {
			CURRENT_POSITION = `${p.x}:${p.y}`;
			CURRENT_ROTATION = r * 90;
			RUNNING_STATE = running;
			STEP_INDEX = i;
		});
		adjustOnResize();
		k.render();
		// set up test env
		// EDITOR.value = sampleCode;
		parseCommands(sampleCommands);
		// dynamically set tick speed 
		document.getElementById('speedrange').oninput = () => 
			k.setTickSpeed(PLAYBACK_SPEED);
		// subscribe to index change event
		currentCommandIndex.subscribe(index => {
			if(index != -1) k.jumpToStep(CURRENT_STEPS_PARSED, index);
		});
		// enable darkmode
		document.body.classList.add('dark');
		canvas.onclick = canvasInteract;

		// SETUP MONACO EDITOR

		monaco.editor.defineTheme('myCoolTheme', {
			base: 'vs-dark',
			inherit: false,
			rules: [       
				{ token: 'green', background: 'FF0000', foreground: '00FF00', fontStyle: 'italic'},
				{ token: 'red', foreground: 'FF0000' , fontStyle: 'bold underline'},
				{ token: 'black', background: '000000' },
				{ token: 'white', foreground: 'FFFFFF' }
			],
			colors: {
				'editor.foreground': '#FFFFFF',
				'editor.background': '#000000',
			}
		});

		monaco.editor.create(document.getElementById('editor'), {
			value: sampleCode,
			language: 'csharp',
			theme: 'vs-dark'
		});
	});

	window.onresize = () => adjustOnResize();

	const canvasInteract = (e:MouseEvent):void => {
		if(SELECTED_FIELD == fields.null)
			k.changeKareszPosition(k.getClickPoint(e));
		else 
			k.changeField(k.getClickPoint(e), SELECTED_FIELD);
	}

	// resize canvas on window resize
	const adjustOnResize = (render:boolean=true):void => {
		canvas.width = document.getElementById('karesz-col').clientWidth - 1;
		canvas.height = document.getElementById('karesz-kontainer').clientHeight - 1;
		if(render) k.resize();
	}

	// wrapper for events
	const startStop = ():void =>{ 
		k.play(CURRENT_STEPS_PARSED, true, changeButtonState, flashCommand);
		changeButtonState(k.running);
	}

	const flashCommand = (index:number):void => {
		document.getElementsByClassName('current-command')[0]?.classList.remove('current-command');
		document.getElementById(`command-index-${index}`).classList.add('current-command');
	}

	const changeButtonState = (on:boolean):void => {
		if(! on) document.getElementsByClassName('current-command')[0]?.classList.remove('current-command');
		startStopButton.classList.remove(on ? 'button-start' : 'button-stop');
		startStopButton.classList.add(on ? 'button-stop' : 'button-start');
		startStopButton.innerText = on ? 'STOP' : 'START';
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
		parseCommands(results.steps);
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
	<div class="grid grid-cols-2 gap-4 h-screen">
		<!-- karesz section -->
		<div class="grid grid-cols-3 gap-4 h-screen">
			<div id="karesz-col" class="select-none grid grid-rows-3 gap-4 col-span-2 h-screen">
				<!-- karesz -->
				<div id="karesz-kontainer" class="karesz-kontainer row-span-2 p-2">
					<canvas bind:this="{canvas}"  width="300" height="300" id="main" class="karesz-kanvas">Your browser doesn't support canvas bruh.</canvas>
				</div>
				<!-- controls -->
				<div class="karesz-settings dark:text-white">
					<div class="px-4"><button bind:this="{startStopButton}" class="button-start font-bold dark:text-white" on:click="{startStop}">START</button></div>
					<div class="karesz-settings-control-section m-4 ">
						<div class="section-div">Controls</div>
						<div class="p-2">
							<label for="speedrange">Tick speed:  <span class="font-bold">{PLAYBACK_SPEED}ms</span></label>
							<br>
							<input id="speedrange" type="range" min="1" max="1000" bind:value="{PLAYBACK_SPEED}" class="form-range appearance-none w-full"/>
						</div>
						<div class="p-2">
							<div class="karesz-starting-state">

							</div>
						</div>
					</div>
					<div class="karesz-settings-container"></div>
					<button class="button-stop font-bold dark:text-white" on:click="{reset}">RESET</button>
				</div>
			</div>
			<div class="result-container">
				<!-- stats -->
				<div class="statistics-container m-2">
					<div class="p-1 dark:text-white text-sm">Position: <span class="font-bold">{CURRENT_POSITION}</span></div>
					<div class="p-1 dark:text-white text-sm">Rotation: <span class="font-bold">{CURRENT_ROTATION}°</span></div>
					<div class="p-1 dark:text-white text-sm"><span class="font-bold">{RUNNING_STATE ? 'Running' : 'Stopped'}</span></div>
					<div class="p-1 dark:text-white text-sm"><span class="font-bold">Current step: {STEP_INDEX}</span></div>
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
		<div id="editor" class="">

		</div>
	</div>
</main>
<!--
<h1>Karezs</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<main class="dark:bg-darkgray">
	
	<div>
		<textarea class="bg-zinc-900" bind:this="{EDITOR}" name="Code karesz here" rows="50" cols="100" id="code"></textarea>
	</div>
	<button on:click="{async() => await submitCode()}">submit</button>
	<br>
	
</main>-->