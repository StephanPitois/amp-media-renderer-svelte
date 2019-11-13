<script>
    export let id = "";
    export let isCanvasSource = false;
    export let width;
    export let height;
    export let fontSize = "20px";
    export let backgroundColor;
    export let backgroundImage;
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
        { w:  4, h:  3 }, { w:  3, h:  4 },
        { w:  6, h:  4 }, { w:  4, h:  6 },
        { w:  7, h:  5 }, { w:  5, h:  7 },
        { w:  8, h:  5 }, { w:  5, h:  8 },
        { w: 16, h:  9 }, { w:  9, h: 16 }
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

    let caalc = function(image) {
        var img = new Image();
        jQuery(img).on('load', function() {
            if (img.width !== 0 && img.height !== 0) {
                let cr = closestRatio(supportedRatios, img.width / img.height);
                aspectRatio = cr;
                aspectRatioClass = `aspect-ratio--${cr.w}x${cr.h}`;
                aspectRatioWrapperClass = `wrapper--${cr.w}x${cr.h}`;
            }
        });
        img.src = image.replace(/url\(|\)$/ig, '');
    };

    $: caalc(backgroundImage);

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

    .square.grid .grid-layout__brand {
        height: 16.67%;
    }

    .square.grid .grid-layout__info {
        height: 16.67%;
    }

    /* 1:1 */
    .square.grid.wrapper--1x1 .grid-layout__graphic {
        height: 66.66%;
    }
    .square.grid.wrapper--1x1 .grid-layout__graphic > div {
        max-width: 66.66%;
    }

    /* 16:9 */
    .square.grid.wrapper--16x9 .grid-layout__graphic {
        height: 45%; /* 80 * 9 / 16 */
    }
    .square.grid.wrapper--16x9 .grid-layout__graphic > div {
        max-width: 80%;
    }

    /* 4:3 */
    .square.grid.wrapper--4x3 .grid-layout__graphic {
        height: 60%; /* 80 * 3 / 4 */
    }
    .square.grid.wrapper--4x3 .grid-layout__graphic > div {
        max-width: 80%;
    }

    /* 3:4 */
    .square.grid.wrapper--3x4 .grid-layout__graphic {
        height: 66.66%;
    }
    .square.grid.wrapper--3x4 .grid-layout__graphic > div {
        max-width: 49.995%; /* 66.66 / 4 * 3 */
    }

    /* 6:4 */
    .square.grid.wrapper--6x4 .grid-layout__graphic {
        height: 53.3333333333%; /* 80 * 4 / 6 */
    }
    .square.grid.wrapper--6x4 .grid-layout__graphic > div {
        max-width: 80%;
    }

    /* 4:6 */
    .square.grid.wrapper--4x6 .grid-layout__graphic {
        height: 66.66%;
    }
    .square.grid.wrapper--4x6 .grid-layout__graphic > div {
        max-width: 44.4466666667%; /* 60 / 6 * 4 */
    }

    /* 7:5 */
    .square.grid.wrapper--7x5 .grid-layout__graphic {
        height: 57.1428571429%; /* 80 * 5 / 7 */
    }
    .square.grid.wrapper--7x5 .grid-layout__graphic > div {
        max-width: 80%;
    }

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
                <div class="aspect-ratio {aspectRatioClass} xxx-aspect-ratio--1x1 ba bw1 b--white w-100">
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
