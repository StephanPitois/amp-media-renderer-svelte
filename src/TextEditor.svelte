<script>
    import TextField from "./TextField.svelte";

    export let brand = '';
    export let title = '';
    export let dates = '';
    export let sponsors = '';
    export let sponsors2 = '';
    export let dark = true;

	function invertColors() {
        dark = !dark;
	}
</script>

<div>
    <form class="pa2 black-80">
        <TextField label="Title" bind:value={title}/>
        <TextField label="Dates" bind:value={dates}/>
        <TextField label="Sponsors - Line 1" bind:value={sponsors}/>
        <TextField label="Sponsors - Line 2" bind:value={sponsors2}/>
        <a href="#0"
           class="f6 link dim br1 ba ph3 pv2 mv2 dib gray"
           on:click|preventDefault={invertColors}>Invert Colors</a>
    </form>
</div>