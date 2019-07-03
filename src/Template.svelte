<script>
    export let brand;
    export let brandsub;
    export let color;
    export let title;
    export let dates;
    export let billing;
    export let licensing;
    export let sponsors;

    export let fontSize = '20px';

    let fontSizes = {
        default: fontSize,
        brand: '75%',
        brandsub: '35%',
        title: '100%',
        dates: '65%',
        billing: '35%',
        licensing: '35%',
        sponsors: '45%',
    };

</script>

<style>
    .amp-aligner {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
</style>

<div class="flex template-wrapper w-100 h-100 pa3 tc" style="font-size: {fontSizes.default}">
    <!-- <div class="template-image" style="opacity: 0">
    </div> -->
    <div class="template-text amp-aligner w-100 fl" style="color: {color}">
        {#if brand}
        <div class="amp-f1 amp-ff1 fw1 bw1 pv1" style="font-size: {fontSizes.brand};">
            {brand}
        </div>
        {/if}
        {#if brandsub}
        <div class="amp-f4 bw1 pv1" style="font-size: {fontSizes.brandsub};">
            {brandsub}
        </div>
        {/if}
        <div>
            {#if title}
            <div class="amp-f0 amp-ff2 ttu fw7 pv1" style="font-size: {fontSizes.title};">
                {title}
            </div>
            {/if}
            {#if dates}
            <div class="amp-f1 fw6 pv1 ttu" style="font-size: {fontSizes.dates};">
                {dates}
            </div>
            {/if}
        </div>
        {#if billing}
        <div class="amp-f4 pv1" style="font-size: {fontSizes.billing};">
            {billing}
        </div>
        {/if}
        {#if licensing}
        <div class="amp-f4 pv1" style="font-size: {fontSizes.licensing};">
            {licensing}
        </div>
        {/if}
        {#if sponsors}
        <div class="amp-f3 pv1" style="font-size: {fontSizes.sponsors};">
            Sponsored by {sponsors}
        </div>
        {/if}
        <!-- <div
            class="fc amp-f3">
            School Edition
        </div> -->
    </div>
</div>