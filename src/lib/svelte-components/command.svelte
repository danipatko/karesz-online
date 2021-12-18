<script lang="ts">
	export let command:string;
	export let value:any;
    export let index:number;   
</script>

<div id="command-index-{index}" class="command-box">
	<span class="command-index">{index}</span>
    <span class="command-name">{command}</span>
    <span class="command-value">
        {#if command == 'r'}
            <span class="command-value-highlighted command-value-number">{value*90}</span>
        {:else if value}
            <span class="command-value-highlighted command-value-coordinate-x">{value.x}</span>:<span class="command-value-highlighted command-value-coordinate-y">{value.y}</span>
        {/if}
    </span>
</div>