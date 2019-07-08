<script>
    export let color = '';
</script>

<div class="flex items-center">
    <input type="color" bind:value={color} >
    <span readonly class="bn ml1 ttu" type="text" style="width: 150px;">{color}</span>
</div>
