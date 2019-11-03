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

  let fontSizes = {
    title: "40%",
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

</script>

<style>
  /* .padding-vertical {
    padding-top: 0.5%;
    padding-bottom: 0.5%;
  } */

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
  style=" width: {width}; height: {height}; color: {color};">
  <div
    class="w-100 h-100 flex items-center bg-white"
    style="font-size: {fontSize};">

    <div
      class="padding-5 bg-white"
      style="width: {height}">
      <div class="aspect-ratio aspect-ratio--1x1">
        <div
          class="aspect-ratio--object cover"
          style="background-image: {backgroundImage}; background-position: center;" />
      </div>
    </div>

    <div
      class="template-text tc flex items-center justify-center flex-column h-100 fl bg-black-90 light-gray padding-vertical-5"
      style="color: {color}; background-color: {backgroundColor}; width: calc(100% - {height});">
      <img
        class="xxx-padding-vertical-5 xxx-bg-green"
        style="width: calc({height} / 3)"
        src="logo.png"
        alt="AMP Logo" />
      <!-- <Logo color="{color}" width="{logoWidth}" /> -->
      {#if dates}
        <div
          class="fw7 ttu padding-vertical-15 xxx-bg-red"
          style="font-size: {fontSizes.dates};">
          {dates}
        </div>
      {/if}
      {#if brand}
        <div
          class="fw7 ttu padding-bottom-5 xxx-bg-silver"
          style="font-size: {fontSizes.brand};">
          {brand}
        </div>
      {/if}
      {#if sponsors}
        <div
          class="fw3 xxx-padding-vertical-5 xxx-bg-blue"
          style="font-size: {fontSizes.sponsors};">
          {sponsors}
        </div>
      {/if}
      {#if sponsors2}
        <div
          class="fw3 xxx-padding-vertical-5 xxx-bg-blue"
          style="font-size: {fontSizes.sponsors};">
          {sponsors2}
        </div>
      {/if}
    </div>

  </div>
</div>
