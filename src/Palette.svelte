<script>
    export let colors = [];
    export let combinations = [];
    export let clickHandler;
</script>

<style>
	.color-tile-sm {
		cursor: pointer;
		width: 29.828px;
		height: 29.828px;
		/* max-width: 9.09%;
		max-height: 9.09%; */
		margin-right: 0;
		margin-bottom: 0;
        font-weight: 600 !important;
		padding-left: 0;
		padding-right: 0;
	}

    @media (max-width: 700px) {
        .color-tile-sm {
            width: 33px;
            height: 33px;
        }
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
