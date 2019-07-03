<script>
	import Palette from "./Palette.svelte";
	import ColorPicker from "./ColorPicker.svelte";

    export let title = '';
    export let color = '';
    export let colors = [];
    export let combinations = [];
    export let changeColor;
    export let changeCombination;
</script>

<div class="fl w-100 pa1 xxxh-100">
    <div class="pa1 ba b--light-gray xxxh-100" xxxstyle="overflow-y: auto">
        <div class="pa2">
            {title}
        </div>
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
</div>