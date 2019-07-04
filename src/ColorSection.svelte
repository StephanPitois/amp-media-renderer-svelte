<script>
	import Palette from "./Palette.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import icons from "./icons.js"

    export let title = '';
    export let color = '';
    export let colors = [];
    export let combinations = [];
    export let changeColor;
    export let changeCombination;
    export let expanded = true;

    function toggleExpanded() {
        expanded = !expanded;
    }
</script>

<style>
    .btn-expand,
    .btn-collapse {
        cursor: pointer;
    }
</style>

<div class="fl w-100 pa1 xxxh-100">
    <div class="ba b--light-gray xxxh-100" xxxstyle="overflow-y: auto">
        <div class="pa2 b--light-gray flex items-center justify-between"
             class:bb={expanded}>
            <span class="w-third">{title}</span>
            <span class="w-third br2 dib ml1 tc" style="background-color: {color}; width: 20%;">&nbsp;</span>
            {#if expanded}
            <span on:click={toggleExpanded} class="w-third tr btn-collapse dib gray">{@html icons.chevronUp}</span>
            {:else}
            <span on:click={toggleExpanded} class="w-third tr btn-expand dib gray">{@html icons.chevronDown}</span>
            {/if}
        </div>
        {#if expanded}
        <div>
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