<script>
    export let activeTab;
    export let tabs = [];

    function clickHandler(event) {
		activeTab = event.target.id;
    }
</script>

<style>
    .tab.active {
        border-bottom: 1px solid #FFF !important;
    }
    .tab:last-of-type {
        border-right: none !important;
    }
    a:focus {
        outline: 0;
    }
</style>

<div class="fl w-100 xpa1 xba bg-light-gray xbt xbb">
    <div class="flex justify-center tc">
        {#each tabs as tab}
            <a
                id="{tab.id}"
                style="cursor: pointer;"
                class="tab w-third f6 gray bg-light-gray link ph3 pv3 xma1 dib bb br b--moon-gray"
                class:blue={activeTab === tab.id}
                class:bg-white={activeTab === tab.id}
                class:active={activeTab === tab.id}
                on:click={clickHandler}
                href="#">{tab.title}</a>
        {/each}
    </div>
</div>
