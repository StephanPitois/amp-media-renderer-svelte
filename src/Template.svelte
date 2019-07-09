<script>
    export let id = '';
    export let isCanvasSource = false;
    export let width;
    export let height;
    export let fontSize = '20px';
    export let backgroundAlpha;
    export let backgroundColor;
    export let backgroundImage;
    export let color;
    export let brand;
    export let brandsub;
    export let title;
    export let dates;
    export let billing;
    export let licensing;
    export let sponsors;

    let fontSizes = {
        brand: '75%',
        brandsub: '35%',
        title: '100%',
        dates: '65%',
        billing: '35%',
        licensing: '35%',
        sponsors: '45%',
    };

    $: rgbaBackground = 'rgba(' + chroma(backgroundColor).alpha(backgroundAlpha).rgba() + ')';

</script>

<style>
    .justify-evenly {
        justify-content: space-evenly;
    }

    .padding-vertical {
        padding-top: 0.5%;
        padding-bottom: 0.5%;
    }

    .canvasSource {
        position: fixed;
		top: -100000px;
		left: -100000px;
		z-index: 1000;
    }
</style>

<div
    id={id}
    class="shadow-5 mv3"
    class:canvasSource={isCanvasSource}
    style="
    width: {width};
    height: {height};
    color: {color};
    background-image: {backgroundImage};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;">
    <div
        class="flex w-100 h-100 pa3 tc"
        style="font-size: {fontSize}; background-color: {rgbaBackground};">
        <div
            class="template-text flex items-center justify-center flex-column w-100 fl"
            style="color: {color}">
            {#if brand}
            <div
                class="amp-f1 amp-ff1 fw1 bw1 padding-vertical"
                style="font-size: {fontSizes.brand};">
                {brand}
            </div>
            {/if}
            {#if brandsub}
            <div
                class="amp-f4 bw1 padding-vertical"
                style="font-size: {fontSizes.brandsub};">
                {brandsub}
            </div>
            {/if}
            {#if title}
            <div
                class="amp-f0 amp-ff2 ttu fw7 padding-vertical"
                style="font-size: {fontSizes.title};">
                {title}
            </div>
            {/if}
            {#if dates}
            <div
                class="amp-f1 fw6 ttu padding-vertical"
                style="font-size: {fontSizes.dates};">
                {dates}
            </div>
            {/if}
            {#if billing}
            <div
                class="amp-f4 padding-vertical"
                style="font-size: {fontSizes.billing};">
                {@html billing}
            </div>
            {/if}
            {#if licensing}
            <div
                class="amp-f4 padding-vertical"
                style="font-size: {fontSizes.licensing};">
                {licensing}
            </div>
            {/if}
            {#if sponsors}
            <div
                class="amp-f3 padding-vertical"
                style="font-size: {fontSizes.sponsors};">
                Sponsored by {sponsors}
            </div>
            {/if}
        </div>
    </div>
</div>