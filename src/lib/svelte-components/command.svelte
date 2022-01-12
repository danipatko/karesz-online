<script lang="ts">
    import { command_eqvivalents } from '$lib/util/karesz';
    export let command:string;
    export let index:number;
    import { currentCommandIndex } from '$lib/svelte-components/store';
    const invokeClick = () => currentCommandIndex.update(x => index);
</script>

<div on:click="{invokeClick}" id="command-index-{index}" class="command-box select-none">
	<span class="command-index text-sm p-1 dark:text-white font-bold">{index+1}</span>
    <span class="command-name text-sm p-1 dark:text-white">{command_eqvivalents[command]}</span>
    <span class="command-value text-sm dark:text-white font-bold">
        <span class="command-value-highlighted command-value-number">{command}</span>
    </span>
</div>