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
  export let vertical = false;
  export let dark = true;

  let fontSizes = {
    title: "70%",
    dates: "55%",
    brand: "35%",
    sponsors: "40%"
  };

  $: artStyle = "width: " + (vertical ? "100%" : height);
  $: infoStyle = "width: " + (vertical ? "100%" : "calc(100% - " + height + ")");
  $: logoStyle = "width: " + (vertical ? "calc(100% / 3)" : "calc(" + height + " / 3)");
  $: logo = dark ? "logo.png" : "logo-black.png";

</script>

<style>

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

  .padding-horizontal-10 {
    padding-left: 10%;
    padding-right: 10%;
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
  class="prompt"
  class:canvasSource={isCanvasSource}
  style=" width: {vertical ? height : width}; height: {vertical ? width : height}; color: {color};">
  <div
    class="w-100 h-100 flex items-center bg-white {vertical ? 'flex-column' : 'flex-row'}"
    style="font-size: {fontSize};">

    <div
      class="h-100"
      style="{artStyle}">
      <div class="aspect-ratio aspect-ratio--1x1">
        <div
          class="aspect-ratio--object cover"
          style="background-image: {backgroundImage}; background-position: center;">
        </div>
      </div>
    </div>

    <div class="h-100" style="{infoStyle}">
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
