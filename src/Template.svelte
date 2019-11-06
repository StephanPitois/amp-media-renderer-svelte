<script>
	// import Logo from "./Logo.svelte";

  export let id = "";
  export let isCanvasSource = false;
  export let width;
  export let height;
  export let fontSize = "20px";
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
  export let sponsors2;
  export let vertical = false;

  let fontSizes = {
    title: "70%",
    dates: "70%",
    brand: "45%",
    sponsors: "40%",
    // brand: "55%",
    // sponsors: "40%",
    brandsub: "35%",
    billing: "35%",
    licensing: "35%"
  };

  // $: logoWidth = parseFloat(height.replace('px', '')) / 3;

  $: artStyle = "width: " + (vertical ? "100%" : height);
  $: infoStyle = "width: " + (vertical ? "100%" : "calc(100% - " + height + ")");
  $: logoStyle = "width: " + (vertical ? "calc(100% / 3)" : "calc(" + height + " / 3)");

</script>

<style>
  /* .padding-vertical {
    padding-top: 0.5%;
    padding-bottom: 0.5%;
  } */

  .padding-left-2 {
    padding-left: 2%;
  }

  .padding-right-2 {
    padding-right: 2%;
  }

  .padding-vertical-4 {
    padding-top: 4%;
    padding-bottom: 4%;
  }

  .padding-left-4 {
    padding-left: 4%;
  }

  .padding-right-4 {
    padding-right: 4%;
  }

  .padding-5 {
    padding: 5% 5%;
  }

  .padding-vertical-5 {
    padding-top: 5%;
    padding-bottom: 5%;
  }

  .padding-bottom-5 {
    padding-bottom: 5%;
  }

  .padding-vertical-15 {
    padding-top: 15%;
    padding-bottom: 15%;
  }

  .canvasSource {
    position: fixed;
    top: -100000px;
    left: -100000px;
    z-index: 1000;
  }
</style>

<div
  {id}
  class=""
  class:canvasSource={isCanvasSource}
  style=" width: {vertical ? height : width}; height: {vertical ? width : height}; color: {color};">
  <div
    class="w-100 h-100 flex items-center bg-white {vertical ? 'flex-column' : 'flex-row'}"
    style="font-size: {fontSize};">

    <div
      class="xxx-padding-vertical-4 xxx-padding-left-4 xxx-padding-right-2 h-100"
      style="{artStyle}">
      <div class="aspect-ratio aspect-ratio--1x1">
        <div
          class="aspect-ratio--object cover"
          style="background-image: {backgroundImage}; background-position: center;">
        </div>
      </div>
    </div>

    <div class="xxx-padding-vertical-4 xxx-padding-left-2 xxx-padding-right-4 h-100" style="{infoStyle}">
      <div
        class="template-text tc flex items-center justify-center flex-column w-100 h-100 fl bg-black-90 light-gray"
        style="color: {color}; background-color: {backgroundColor};">
        <img
          class="xxx-padding-vertical-5"
          style="{logoStyle}"
          src="logo.png"
          alt="AMP Logo" />
        <!-- <Logo color="{color}" width="{logoWidth}" /> -->
        <!-- {#if title}
          <div
            class="fw7 ttu padding-vertical-5"
            style="font-size: {fontSizes.title};">
            {title}
          </div>
        {/if} -->
        {#if dates}
          <div
            class="fw7 ttu padding-vertical-15"
            style="font-size: {fontSizes.dates};">
            {dates}
          </div>
        {/if}
        {#if brand}
          <div
            class="fw7 ttu padding-bottom-5"
            style="font-size: {fontSizes.brand};">
            {brand}
          </div>
        {/if}
        {#if sponsors}
          <div
            class="fw3 xxx-padding-vertical-5"
            style="font-size: {fontSizes.sponsors};">
            {sponsors}
          </div>
        {/if}
        {#if sponsors2}
          <div
            class="fw3 xxx-padding-vertical-5"
            style="font-size: {fontSizes.sponsors};">
            {sponsors2}
          </div>
        {/if}
      </div>
    </div>

  </div>
</div>
