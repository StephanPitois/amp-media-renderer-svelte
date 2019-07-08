<script>
	import Palette from "./Palette.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import icons from "./icons.js"

    export let id;
    export let title = '';
    export let color = '';
    export let colors = [];
    export let combinations = [];
    export let changeColor;
    export let changeCombination;
    export let expanded = false;
    export let toggleExpanded = (id) => {};

    function onToggleExpanded() {
        toggleExpanded(id);
    }
</script>

<div id={id} class="fl w-100">
    <div class="bb b--moon-gray">
        <div class="cursor-pointer pa3 b--light-gray flex items-center justify-between"
             class:bb={expanded}
             on:click={onToggleExpanded}>
            <span class="w-third">{title}</span>
            <span class="w-third br2 dib ml1 tc" style="background-color: {color}; width: 20%;">&nbsp;</span>
            {#if expanded}
            <span class="w-third tr btn-collapse dib gray">{@html icons.chevronUp}</span>
            {:else}
            <span class="w-third tr btn-expand dib gray">{@html icons.chevronDown}</span>
            {/if}
        </div>
        {#if expanded}
        <div class="pa2 bg-near-white amp-scroll-y">
            <div class="pa2">
                <ColorPicker bind:color={color} />
            </div>
            <div class="pa2">
                <Palette colors={colors} clickHandler={changeColor} />
            </div>
            <div class="pa2">
                Suggested Combinations
            </div>
            <div class="pa2">
                <Palette combinations={combinations} clickHandler={changeCombination} />
            </div>
        </div>
        {/if}
    </div>
</div>