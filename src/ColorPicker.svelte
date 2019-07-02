<script>
    export let color = '';
</script>

<div class="flex items-center">
    <input type="color" bind:value={color} >
    <input class="bn ml1 ttu" type="text" bind:value={color} style="width: 150px; ">
</div>
