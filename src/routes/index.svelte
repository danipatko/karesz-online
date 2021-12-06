<script lang="ts" context="module">

	export async function load({ page, fetch }) {
		const { id } = page.query;
  
		if(! id) return {
			status: 200,
			props: {
				data:undefined
			}
		};
  
		const result = await fetch(`/projects/${id}`);
	  	return {
			status: 200,
			props: { 
		  		data: await result.json() 
			}
	  	};
	}

</script>
<script lang="ts">
	// import ErrorPage from '$lib/svelte-components/error.svelte';
	import { onMount } from 'svelte';
	import { kanvas } from '$lib/front/kanvas';
	export let data:object;
	export let canvas:HTMLCanvasElement;
	  
	onMount(() => {
		console.log('INNIT');
		const k = new kanvas(10, 10, canvas);
		k.add({x:3,y:3}, 'square', '#f00', 'wall');
		k.add({x:2,y:2}, 'circle', '#ff0', 'rock');
		k.add({x:3,y:3}, 'svg', 'http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg', 'asd');
		k.render();
	});
	  
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
</main>