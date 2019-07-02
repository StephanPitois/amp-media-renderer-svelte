<script>
    export let colors = [];
    export let combinations = [];
    export let clickHandler;
</script>

<style>
	.color-tile-sm {
		cursor: pointer;
		width: 30px;
		height: 30px;
		margin-right: 0;
		margin-bottom: 0;
        font-weight: 600 !important;
		padding-left: 0;
		padding-right: 0;
	}
	button.color-tile-sm:focus {
		outline: 0;
    }
</style>

{#if !!combinations && combinations.length > 0}
    {#each combinations as combination}
    <button
        class="br0 bn color-tile-sm fw9"
        style="color: {combination.color}; background-color: {combination.backgroundColor}"
        on:click={clickHandler}>Aa</button>
    {/each}
{:else if !!colors && colors.length > 0}
    {#each colors as color}
    <button
        class="br0 bn color-tile-sm fw9"
        style="background-color: {color}"
        on:click={clickHandler}>&nbsp;</button>
    {/each}
{/if}
