import { writable } from 'svelte/store';
export let commandStore = writable([{}]);
export let currentCommandIndex = writable(-1);