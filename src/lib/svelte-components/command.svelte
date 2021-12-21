<script lang="ts">
    import { command_eqvivalents } from '$lib/karesz/karesz-utils';
    export let command:string;
	export let value:any;
    export let index:number;
    import { currentCommandIndex } from '$lib/svelte-components/store';
    const invokeClick = () => currentCommandIndex.update(x => index);
</script>

<div on:click="{invokeClick}" id="command-index-{index}" class="command-box select-none">
	<span class="command-index text-sm p-1 dark:text-white font-bold">{index+1}</span>
    <span class="command-name text-sm p-1 dark:text-white">{command_eqvivalents[command]}</span>
    <span class="command-value text-sm dark:text-white font-bold">
        {#if command == 'r'}
            <span class="command-value-highlighted command-value-number">{value*90}°</span>
        {:else if value}
            <span class="command-value-highlighted command-value-coordinate-x">{value.x}</span>:<span class="command-value-highlighted command-value-coordinate-y">{value.y}</span>
        {/if}
    </span>
</div>