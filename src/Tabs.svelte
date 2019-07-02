<script>
    export let activeTab;
    export let tabs = [];

    function clickHandler(event) {
		activeTab = event.target.id;
    }
</script>

<style>
    .tab {
        border-bottom: 1px solid #CCC !important;
    }
    .tab.active {
        border-bottom: 1px solid #FFF !important;
        background-color: #FFF !important;
        color: #000 !important;
    }
    a:focus {
        outline: 0;
    }
</style>

<div class="fl w-100 ph2 pt3 pb1">
    <div class="mh1 bb b--moon-gray">
        {#each tabs as tab}
            <a
                id="{tab.id}"
                style="margin-bottom: -1px; cursor: pointer;"
                class="tab f6 dark-gray bg-light-gray link bl bt br br2 br--top ph3 pv2 mv0 ml1 mr1 dib b--moon-gray"
                class:active={activeTab === tab.id}
                on:click={clickHandler}
                href="#">{tab.title}</a>
        {/each}
    </div>
</div>
