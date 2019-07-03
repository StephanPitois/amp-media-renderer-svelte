<script>
    import TextField from "./TextField.svelte";

    export let brand = '';
    export let brandsub = '';
    export let title = '';
    export let dates = '';
    export let billing = '';
    export let licensing = '';
    export let sponsors = '';
</script>

<div>
    <form class="pa4 black-80">
        <TextField label="Brand" bind:value={brand}/>
        <TextField label="Below Brand" bind:value={brandsub}/>
        <TextField label="Title" bind:value={title}/>
        <TextField label="Dates" bind:value={dates}/>
        <!-- FIXME: Billing, Licensing should be text areas (multi line) -->
        <TextField label="Billing" bind:value={billing}/>
        <TextField label="Licensing" bind:value={licensing}/>
        <TextField label="Sponsors" bind:value={sponsors}/>
    </form>
</div>