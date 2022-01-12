<script lang="ts">
    export let command:string;
    export let index:number;
    import { currentCommandIndex } from '$lib/svelte-components/store';
    const invokeClick = () => currentCommandIndex.update(x => index);
</script>

<div on:click="{invokeClick}" id="command-index-{index}" class="command-box select-none">
	<span class="command-index text-sm p-1 dark:text-white font-bold">{index+1}</span>
    <span class="command-value text-sm dark:text-white">{command}</span>
</div>