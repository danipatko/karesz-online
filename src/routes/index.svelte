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
	let SELECTED_FIELD:fields = -1;
	let startStopButton:HTMLDivElement;
	let editor:any;
	export let STARTING_POINT:point = {x:5, y:5};
	export let STARTING_ROTATION:rotations = rotations.up;
	export let MAP_SIZE:number = 20;

	export let STEP_INDEX = 0;
	export let RUNNING_STATE = 0;
	export let PLAYBACK_SPEED = 100;
	export let CURRENT_POSITION:string;
	export let CURRENT_ROTATION:number;

	import * as monaco from 'monaco-editor';

	// window.onload
	onMount(() => {
		adjustOnResize(false);
		// create new karesz canvas, fill default editor and test instuctions
		k = new kanvas(20, 20, canvas, (p, r, i, running) => {
			CURRENT_POSITION = `${p.x}:${p.y}`;
			CURRENT_ROTATION = r * 90;
			RUNNING_STATE = running;
			STEP_INDEX = i;
		});
		adjustOnResize();
		k.render();
		// set up test env
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

		editor = monaco.editor.create(document.getElementById('editor'), {
			value: sampleCode,
			language: 'csharp',
			theme: 'vs-dark'
		});

		document.getElementById('mapsize-range').oninput = () => 
			k.resetCells(MAP_SIZE);
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
		const e = document.getElementById('karesz-kommand-kontainer');
		e.style.maxHeight = `${window.innerHeight - e.offsetTop - 20}px`;
		if(render) k.resize();
	}

	// wrapper for events
	const startStop = ():void =>{ 
		k.play(CURRENT_STEPS_PARSED, true, changeButtonState, flashCommand);
		changeButtonState(k.running);
	}

	const flashCommand = (index:number):void => {
		document.getElementsByClassName('current-command')[0]?.classList.remove('current-command');
		const e = document.getElementById(`command-index-${index}`)
		e.classList.add('current-command');
		e.scrollIntoView({ behavior:'smooth' });
	}

	const changeButtonState = (on:boolean):void => {
		if(! on) document.getElementsByClassName('current-command')[0]?.classList.remove('current-command');
		startStopButton.classList.remove(on ? 'hover:bg-green-500' : 'hover:bg-red-600');
		startStopButton.classList.add(on ? 'hover:bg-red-600' : 'hover:bg-green-500');
		startStopButton.innerText = on ? 'STOP' : 'PLAY';
	}

	// wrapper
	const reset = ():void => 
		k.reset();

	// parse string commands to an array of instructions (global => CURRENT_STEPS_PARSED)
	const parseCommands = (commands:string):void => {
		CURRENT_STEPS_PARSED = k.parseCommands(commands);
		listCommands(CURRENT_STEPS_PARSED);
		k.toStart();
	}

	const saveStartingState = ():void => {
		k.setStartingState();
		STARTING_POINT = k.kareszes[0].position;
		STARTING_ROTATION = k.kareszes[0].rotation;
	}

	// send code to server
	// required params: code to compile, map size, starting point and rotation
	const submitCode = async():Promise<void> => {
		saveStartingState();
		$commandStore = [];
		const result = await fetch(`/run/dotnet`, {
			body: JSON.stringify({
				code:editor.getValue(), 
				karesz: k.generateMapData()
			}),
			method:'post',
		});
		if(!result.ok) return;
		const { results } = await result.json();
		console.log(results);
		parseCommands(results.steps);
		CURRENT_STATISTICS = { exec_time: results.exec_time, ...results.statistics };
	}

	// populate $commandStore 
	const listCommands = (commands: instruction[]) => {
		for (let i = 0; i < commands.length; i++) 
			$commandStore[i] = { index:i, command:commands[i].command, value:commands[i].value };
	}

</script>

<main class="dark:bg-darkgray">
	<div class="grid grid-cols-2 gap-2 h-screen">
		<!-- karesz section -->
		<div class="grid grid-cols-3 gap-4 h-screen py-2 pl-2">
			<div id="karesz-col" class="select-none grid grid-rows-3 gap-4 col-span-2 h-screen">
				<!-- karesz -->
				<div id="karesz-kontainer" class="karesz-kontainer row-span-2">
					<canvas bind:this="{canvas}"  width="300" height="300" id="main" class="karesz-kanvas">Your browser doesn't support canvas bruh.</canvas>
				</div>
				<div class="karesz-settings dark:text-white grid grid-cols-2 gap-4">
					<!-- map -->
					<div class="p-2">
						<div class="text-sm text-zinc-500 border-b border-zinc-600 mb-3">Map settings</div>
						<div class="p-2">
							<label for="mapsize-range">Map size: <span class="font-bold">{MAP_SIZE}x{MAP_SIZE} </span></label>
							<br>
							<input id="mapsize-range" type="range" min="10" max="50" step="10" class="w-full" bind:value="{MAP_SIZE}"/>
						</div>
						<div class="p-2">
							<label for="selected-field" class="pr-2">Select field: </label>
							<select bind:value="{SELECTED_FIELD}" name="selected object" id="selected-field" class="bg-darkgray font-bold">
								<option value="-1">None</option>
								<option value="0">Clear</option>
								<option value="1">Wall</option>
								<option value="2">Black rock</option>
								<option value="3">Red rock</option>
								<option value="4">Green rock</option>
								<option value="5">Yellow rock</option>
							</select>
						</div>
						<div class="p-2">
							<label for="selected-map" class="pr-2">Load map: </label>
							<select name="selected object" id="selected-map" class="bg-darkgray font-bold">
								<option value="-1">empty</option>
								<option value="0">palya1.txt</option>
								<option value="1">palya2.txt</option>
								<option value="2">palya3.txt</option>
								<option value="3">palya4.txt</option>
								<option value="4">palya5.txt</option>
								<option value="5">palya6.txt</option>
							</select>
						</div>
					</div>

				</div>
			</div>
			<div class="result-container max-h-screen">
				<div class="buttons grid-cols-3 grid select-none">
					<div bind:this="{startStopButton}" on:click="{startStop}" class="p-2 font-bold cursor-pointer bg-zinc-600 dark:text-white hover:bg-green-500 text-center">PLAY</div>
					<div on:click="{reset}" class="p-2 font-bold cursor-pointer bg-zinc-600 dark:text-white hover:bg-green-500 text-center">RESET</div>
					<div on:click="{submitCode}" class="p-2 font-bold cursor-pointer bg-zinc-600 dark:text-white hover:bg-green-500 text-center">RUN</div>
				</div>
				<!-- stats -->
				<div class="statistics-container m-2">
					<div class="p-1 dark:text-white text-sm">Position: <span class="font-bold">{CURRENT_POSITION}</span></div>
					<div class="p-1 dark:text-white text-sm">Rotation: <span class="font-bold">{CURRENT_ROTATION}°</span></div>
					<div class="p-1 dark:text-white text-sm"><span class="font-bold">{RUNNING_STATE ? 'Running' : 'Stopped'}</span></div>
					<div class="p-1 dark:text-white text-sm">Current step: <span class="font-bold">{STEP_INDEX}</span></div>
					<div class="p-1 dark:text-white text-sm">
						<label for="speedrange">Tick time: <span class="font-bold">{PLAYBACK_SPEED}ms</span></label>
						<br>
						<input id="speedrange" type="range" min="1" max="1000" class="w-full" bind:value="{PLAYBACK_SPEED}"/>
					</div>
				</div>
				<div id="karesz-kommand-kontainer" class="overflow-y-scroll">
					<!-- command list -->
					{#each $commandStore as item}
						<svelte:component this={Command} index={item['index']} command={item['command']} value={item['value']}/>
					{/each}
				</div>
			</div>
		</div>
		<!-- Editor section -->
		<div id="editor">

		</div>
	</div>
</main>
