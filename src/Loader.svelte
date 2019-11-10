<script>
	import { fade } from 'svelte/transition';

    // Input
    export let text;
    // Input/Output
    export let visible = false;
</script>

{#if visible}
<div
    out:fade
    class="flex bg-white gray tc h-100 justify-center flex-column"
    style="position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 2000;">
    <div class="f3">{text}</div>
</div>
{/if}