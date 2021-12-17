<script lang="ts">
    import type { instruction } from "$lib/karesz/karesz-utils";
	export let instr:instruction;

    export const val = () => {
        switch(instr.command){
            case 'r': 
                return `${instr.value * 90}°`;
            default:
                return `${instr.value.x}:${instr.value.y}`;
        }
    }
</script>

<div class="command-box">
	<span>{instr.command}</span>
	<span>{instr.value}</span>
</div>