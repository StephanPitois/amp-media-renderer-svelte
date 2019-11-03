<script>
    import TextField from "./TextField.svelte";

    export let brand = '';
    export let brandsub = '';
    export let title = '';
    export let dates = '';
    export let billing = '';
    export let licensing = '';
    export let sponsors = '';
    export let sponsors2 = '';
</script>

<div>
    <form class="pa2 black-80">
        <TextField label="Dates" bind:value={dates}/>
        <!-- <div>
            <label for="dates" class="f6 b db mb2">Dates</label>
            <textarea
                id="dates"
                name="dates"
                class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb3"
                rows="3"
                bind:value="{dates}"
                aria-describedby="dates-desc" />
        </div> -->
        <!-- <TextField label="Brand" bind:value={brand}/> -->
        <TextField label="Sponsors - Line 1" bind:value={sponsors}/>
        <TextField label="Sponsors - Line 2" bind:value={sponsors2}/>
        <!-- <div>
            <label for="dates" class="f6 b db mb2">Sponsors</label>
            <textarea
                id="sponsors"
                name="sponsors"
                class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb3"
                rows="3"
                bind:value="{sponsors}"
                aria-describedby="sponsors-desc" />
        </div> -->
        <!-- <TextField label="Below Brand" bind:value={brandsub}/> -->
        <!-- <TextField label="Title" bind:value={title}/> -->
        <!-- <TextField label="Billing" bind:value={billing}/> -->
        <!-- <div>
            <label for="comment" class="f6 b db mb2">Billing</label>
            <textarea
                id="comment"
                name="comment"
                class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb3"
                rows="5"
                bind:value="{billing}"
                aria-describedby="comment-desc" />
        </div> -->
        <!-- <TextField label="Licensing" bind:value={licensing}/> -->
    </form>
</div>