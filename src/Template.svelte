<script>
    export let id = "";
    export let isCanvasSource = false;
    export let width;
    export let height;
    export let fontSize = "20px";
    export let backgroundColor;
    export let backgroundImage;
    export let backgroundImageWidth;
    export let backgroundImageHeight;

    export let color;
    export let brand;
    export let title;
    export let dates;
    export let sponsors;
    export let sponsors2;
    export let dark = true;

    let fontSizes = {
        title: "70%",
        dates: "55%",
        brand: "35%",
        sponsors: "40%"
    };

    $: vertical = parseFloat(height.replace("px", "")) >= parseFloat(width.replace("px", ""));
    $: isSquare = parseFloat(height.replace("px", "")) === parseFloat(width.replace("px", ""));

    $: artStyle = vertical
        ? `width: ${isSquare ? "75%" : width}; height: ${isSquare ? "75%" : width}; padding: ${isSquare ? "0%" : "0"};`
        : `width: ${height}; height: ${height};`;

    $: infoStyle = vertical
        ? `width: ${width}; height: calc(${height} - ${isSquare ? "75%" : width});`
        : `width: calc(100% - ${height}); height: ${height};`;

    $: logoStyle = vertical
        ? `width: calc(${width} / 6);`
        : `width: calc(${height} / 3);`;

    $: canvasStyle = `width: ${width}; height: ${height}; color: ${color};`;

    $: logo = dark ? "logo.png" : "logo-black.png";

    let supportedRatios = [
        { w:  1, h:  1 },
        { w:  4, h:  3 },
        { w:  6, h:  4 },
        { w:  7, h:  5 },
        { w:  8, h:  5 },
        { w: 16, h:  9 },
        { w:  3, h:  4 },
        { w:  4, h:  6 },
        { w:  5, h:  7 },
        { w:  5, h:  8 },
        { w:  9, h: 16 }
    ];

    supportedRatios = supportedRatios.map(r => {
        r.q = r.w / r.h;
        return r;
    });

    let closestRatio = function(supportedRatios, goal) {
        return supportedRatios.reduce(function(accumulator, currentValue) {
            return (Math.abs(currentValue.q - goal) < Math.abs(accumulator.q - goal) ? currentValue : accumulator);
        });
    };

    let aspectRatio = { w:  1, h:  1 };
    let aspectRatioClass = 'aspect-ratio--1x1';
    let aspectRatioWrapperClass = 'wrapper--1x1';

    $: {
        if (backgroundImageWidth !== 0 && backgroundImageHeight !== 0) {
            let cr = closestRatio(supportedRatios, backgroundImageWidth / backgroundImageHeight);
            aspectRatio = cr;
            aspectRatioClass = `aspect-ratio--${cr.w}x${cr.h}`;
            aspectRatioWrapperClass = `wrapper--${cr.w}x${cr.h}`;
        }
    }

</script>

<style>
    .canvasSource {
        position: fixed;
        top: -100000px;
        left: -100000px;
        z-index: 1000;
    }

    .square.grid {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
    }

    :root{
        --image-square-height-as-percentage: 66.66%;
        --image-square-width-as-percentage: 66.66%;

        --image-tall-height-as-percentage: 66.66%;
        --image-tall-height-factor: 66.66;

        --image-wide-width-as-percentage: 80%;
        --image-wide-width-factor: 80;
    }

    .square.grid .grid-layout__brand {
        height: 16.67%;
    }

    .square.grid .grid-layout__info {
        height: 16.67%;
    }

    /* 1:1 */
    .square.grid.wrapper--1x1 .grid-layout__graphic {
        height: var(--image-square-height-as-percentage);
    }
    .square.grid.wrapper--1x1 .grid-layout__graphic > div {
        max-width: var(--image-square-width-as-percentage);
    }

    .square.grid.wrapper--4x3 .grid-layout__graphic { height: 60%; /* 3 / 4 * 80 */ }
    .square.grid.wrapper--6x4 .grid-layout__graphic { height: 53.3333333333%; /* 4 / 6 * 80 */ }
    .square.grid.wrapper--7x5 .grid-layout__graphic { height: 57.1428571429%; /* 5 / 7 * 80 */ }
    .square.grid.wrapper--8x5 .grid-layout__graphic { height: 57.1428571429%; /* 5 / 8 * 80 */ }
    .square.grid.wrapper--16x9 .grid-layout__graphic { height: 45%; /* 9 / 16 * 80 */ }

    .square.grid.wrapper--4x3 .grid-layout__graphic > div,
    .square.grid.wrapper--6x4 .grid-layout__graphic > div,
    .square.grid.wrapper--7x5 .grid-layout__graphic > div,
    .square.grid.wrapper--8x5 .grid-layout__graphic > div,
    .square.grid.wrapper--16x9 .grid-layout__graphic > div {
        max-width: var(--image-wide-width-as-percentage);
    }

    .square.grid.wrapper--3x4 .grid-layout__graphic,
    .square.grid.wrapper--4x6 .grid-layout__graphic,
    .square.grid.wrapper--5x7 .grid-layout__graphic,
    .square.grid.wrapper--5x8 .grid-layout__graphic,
    .square.grid.wrapper--9x19 .grid-layout__graphic {
        height: var(--image-tall-height-as-percentage);
    }

    .square.grid.wrapper--3x4 .grid-layout__graphic > div { max-width: 49.995%; /* 3 / 4 * 66.66 */ }
    .square.grid.wrapper--4x6 .grid-layout__graphic > div { max-width: 44.44%; /* 4 / 6 * 66.66 */ }
    .square.grid.wrapper--5x7 .grid-layout__graphic > div { max-width: 47.61428571%; /* 5 / 7 * 66.66 */ }
    .square.grid.wrapper--5x8 .grid-layout__graphic > div { max-width: 41.6625%; /* 5 / 8 * 66.66 */ }
    .square.grid.wrapper--9x16 .grid-layout__graphic > div { max-width: 37.49625%; /* 9 / 16 * 66.66 */ }

</style>

<div
    {id}
    class="prompt"
    class:canvasSource={isCanvasSource}
    style={canvasStyle}>

    <div
        class:dn={!isSquare}
        class:grid={isSquare}
        class="square grid w-100 h-100 items-center bg-white {aspectRatioWrapperClass}"
        style="font-size: {fontSize}; background-color: {backgroundColor};">

        <div class="h-100 w-100 grid-layout__brand">
            <div class="h-100 w-100 flex items-center justify-evenly flex-column">
                <img class="" style={logoStyle} src={logo} alt="AMP Logo" />
                {#if brand}
                    <div class="fw5 ttu" style="font-size: {fontSizes.brand};">
                        {brand}
                    </div>
                {/if}
            </div>
        </div>

        <div class="h-100 w-100 grid-layout__graphic">
            <div class="h-100 w-100 center flex items-center justify-center flex-column">
                <div class="aspect-ratio {aspectRatioClass} ba bw1 b--white w-100">
                    <div
                        class="aspect-ratio--object cover background-image"
                        style="background-image: {backgroundImage}; background-position:
                        center;" />
                </div>
            </div>
        </div>

        <div class="h-100 w-100 grid-layout__info">
            <div
                class="padding-horizontal-10 template-text tc flex items-center
                justify-evenly flex-column w-100 h-100 fl light-gray"
                style="color: {color}; background-color: {backgroundColor};">

                {#if title}
                    <div
                        class="fw6 ttu"
                        style="font-size: {fontSizes.title};">
                        {title}
                    </div>
                {/if}

                {#if dates}
                    <div class="fw5 ttu" style="font-size: {fontSizes.dates};">
                        {dates}
                    </div>
                {/if}

                {#if sponsors || sponsors2}
                    <div>
                        {#if sponsors}
                            <div class="fw2" style="font-size: {fontSizes.sponsors};">
                                {sponsors}
                            </div>
                        {/if}
                        {#if sponsors2}
                            <div class="fw2" style="font-size: {fontSizes.sponsors};">
                                {sponsors2}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

    </div>

    <div
        class:dn={isSquare}
        class:flex={!isSquare}
        class="w-100 h-100 items-center bg-white {vertical ? 'flex-column' : 'flex-row'}"
        style="font-size: {fontSize}; background-color: {backgroundColor};">

        <div style={artStyle} class="bg-white">
            <div class="aspect-ratio aspect-ratio--1x1">
                <div
                    class="aspect-ratio--object cover"
                    style="background-image: {backgroundImage}; background-position:
                    center;" />
            </div>
        </div>

        <div style={infoStyle}>
            <div
                class="padding-horizontal-10 template-text tc flex items-center
                justify-evenly flex-column w-100 h-100 fl light-gray"
                style="color: {color}; background-color: {backgroundColor};">
                {#if title || dates}
                    <div>
                        {#if title}
                            <div
                                class="fw6 ttu padding-bottom-5"
                                style="font-size: {fontSizes.title};">
                                {title}
                            </div>
                        {/if}
                        {#if dates}
                            <div class="fw5 ttu" style="font-size: {fontSizes.dates};">
                                {dates}
                            </div>
                        {/if}
                    </div>
                {/if}
                <div>
                    <img class="" style={logoStyle} src={logo} alt="AMP Logo" />
                    {#if brand}
                        <div class="fw5 ttu" style="font-size: {fontSizes.brand};">
                            {brand}
                        </div>
                    {/if}
                </div>
                {#if sponsors || sponsors2}
                    <div>
                        {#if sponsors}
                            <div class="fw2" style="font-size: {fontSizes.sponsors};">
                                {sponsors}
                            </div>
                        {/if}
                        {#if sponsors2}
                            <div class="fw2" style="font-size: {fontSizes.sponsors};">
                                {sponsors2}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

    </div>

</div>
