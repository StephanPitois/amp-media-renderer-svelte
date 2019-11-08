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

  $: vertical = parseFloat(height.replace('px', '')) >= parseFloat(width.replace('px', ''));
  $: isSquare = parseFloat(height.replace('px', '')) === parseFloat(width.replace('px', ''));

  $: artStyle    = vertical ? `width: ${isSquare ? '75%' : width};
                               height: ${isSquare ? '75%' : width};
                               padding: ${isSquare ? '0%' : '0'};`
                            : `width: ${height}; height: ${height};`;

  $: infoStyle   = vertical ? `width: ${width}; height: calc(${height} - ${isSquare ? '75%' : width});`
                            : `width: calc(100% - ${height}); height: ${height};`;

  $: logoStyle   = vertical ? `width: calc(${width} / 6);`
                            : `width: calc(${height} / 3);`;

  $: canvasStyle = `width: ${width}; height: ${height}; color: ${color};`

  $: logo = dark ? "logo.png" : "logo-black.png";

</script>

<style>

  .canvasSource {
    position: fixed;
    top: -100000px;
    left: -100000px;
    z-index: 1000;
  }

  .square.grid {
    display: grid;
    grid-template-columns: 16.6666666667% auto 16.6666666667%;
    grid-template-rows: 16.6666666667% auto 16.6666666667%;
    grid-template-areas:
      'brand brand brand'
      'lane-left graphic lane-right'
      'info info info';
  }

	.grid-layout__lane-left {
		grid-area: lane-left;
	}

	.grid-layout__lane-right {
		grid-area: lane-right;
	}

  .grid-layout__brand {
		grid-area: brand;
	}

	.grid-layout__graphic {
		grid-area: graphic;
	}

	.grid-layout__info {
		grid-area: info;
	}

</style>

<div
  {id}
  class="prompt"
  class:canvasSource={isCanvasSource}
  style="{canvasStyle}">

  <div
    class:dn={!isSquare}
    class:grid={isSquare}
    class="square grid w-100 h-100 items-center bg-white"
    style="font-size: {fontSize}; background-color: {backgroundColor};">

    <div class="h-100 grid-layout__lane-left">
    </div>

    <div class="h-100 grid-layout__lane-right">
    </div>

    <div class="h-100 w-100 grid-layout__brand">
      <div class="h-100 w-100 flex items-center justify-evenly flex-column">
        <img
          class=""
          style="{logoStyle}"
          src="{logo}"
          alt="AMP Logo" />
        {#if brand}
          <div
            class="fw5 ttu"
            style="font-size: {fontSizes.brand};">
            {brand}
          </div>
        {/if}
      </div>
    </div>

    <div class="h-100 w-100 grid-layout__graphic black bg-blue">
      <div class="h-100 w-100 ba b--light-silver">
        <div class="aspect-ratio aspect-ratio--1x1">
          <div
            class="aspect-ratio--object cover "
            style="background-image: {backgroundImage}; background-position: center;">
          </div>
        </div>
      </div>
    </div>

    <div class="h-100 w-100 grid-layout__info black bg-yellow">
      <div
        class="padding-horizontal-10 template-text tc flex items-center justify-evenly flex-column w-100 h-100 fl light-gray"
        style="color: {color}; background-color: {backgroundColor};">
        {#if title}
        <div
          class="fw6 ttu xxx-padding-bottom-5"
          style="font-size: {fontSizes.title};">
          {title}
        </div>
        {/if}
        {#if dates}
        <div
          class="fw5 ttu"
          style="font-size: {fontSizes.dates};">
          {dates}
        </div>
        {/if}
        {#if sponsors || sponsors2}
        <div>
          {#if sponsors}
          <div
            class="fw2"
            style="font-size: {fontSizes.sponsors};">
            {sponsors}
          </div>
          {/if}
          {#if sponsors2}
          <div
            class="fw2"
            style="font-size: {fontSizes.sponsors};">
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

    <div style="{artStyle}">
      <div class="aspect-ratio aspect-ratio--1x1">
        <div
          class="aspect-ratio--object cover"
          style="background-image: {backgroundImage}; background-position: center;">
        </div>
      </div>
    </div>

    <div style="{infoStyle}">
      <div
        class="padding-horizontal-10 template-text tc flex items-center justify-evenly flex-column w-100 h-100 fl light-gray"
        style="color: {color}; background-color: {backgroundColor};">
        <div>
        {#if title}
          <div
            class="fw6 ttu padding-bottom-5"
            style="font-size: {fontSizes.title};">
            {title}
          </div>
        {/if}
        {#if dates}
          <div
            class="fw5 ttu"
            style="font-size: {fontSizes.dates};">
            {dates}
          </div>
        {/if}
        </div>
        <div>
          <img
            class=""
            style="{logoStyle}"
            src="{logo}"
            alt="AMP Logo" />
          {#if brand}
            <div
              class="fw5 ttu"
              style="font-size: {fontSizes.brand};">
              {brand}
            </div>
          {/if}
        </div>
        {#if sponsors || sponsors2}
          <div>
          {#if sponsors}
            <div
              class="fw2"
              style="font-size: {fontSizes.sponsors};">
              {sponsors}
            </div>
          {/if}
          {#if sponsors2}
            <div
              class="fw2"
              style="font-size: {fontSizes.sponsors};">
              {sponsors2}
            </div>
          {/if}
          </div>
        {/if}
      </div>
    </div>

  </div>

</div>
