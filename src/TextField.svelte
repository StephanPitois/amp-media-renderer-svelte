<script>
    export let label;
    export let value;
</script>

<div class="measure">
    <label for="name" class="f6 b db mb2">{label}</label>
    <input
        id="name"
        class="input-reset ba b--black-20 pa2 mb3 db w-100"
        type="text"
        bind:value={value}
        aria-describedby="name-desc">
    <!-- <label for="name" class="f6 b db mb2">Name <span class="normal black-60">(optional)</span></label>
    <input id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
    <small id="name-desc" class="f6 black-60 db mb2">Helper text for the form control.</small> -->
</div>
