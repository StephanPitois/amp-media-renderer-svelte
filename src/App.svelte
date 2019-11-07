<script>
	import config from "./config.js";
	import utils from "./utils.js";
	import icons from "./icons.js";

	import Tabs from "./Tabs.svelte";
	import Template from "./Template.svelte";
	import TextEditor from "./TextEditor.svelte";
    import TextField from "./TextField.svelte";

	// http://tachyons.io/docs/themes/skins/
	// https://webaim.org/articles/contrast/#sc143

	// @custom-media --breakpoint-not-small screen and (min-width: 30em);
	// @custom-media --breakpoint-medium screen and (min-width: 30em) and (max-width: 60em);
	// @custom-media --breakpoint-large screen and (min-width: 60em);

	// If body has default pixel size of 16px, then:
	//	- 30em = 480px
	//	- 60em = 960px

	const params = new URLSearchParams(window.location.search);

	let vertical = false;
	let dark = true;

	$: color = dark ? "#FFFFFF": "#202020";
	$: backgroundColor = dark ? "#202020" : "#FFFFFF";

	let title = params.get("title");
	let dates = params.get("dates");
	let brand = params.get("brand") || config.defaultBrand;

	let sponsors = utils.stripHtml(params.get("sponsors") || '');
	if (sponsors) {
		sponsors = 'Sponsored by ' + sponsors;
	}
	let sponsors2 = '';

	// See also _redirects
	let backgroundImageUrl = (params.get("bgimage") || '').replace('https://www.ameliamusicalplayhouse.com/wp-content', '') || config.defaultImage;

	let activeTab = "text";
	let tabs = [
		{ id: "text", title: "Text"},
		{ id: "graphics", title: "Graphics"}
	];

	let templateName = 'Facebook Event Cover';
	// let customWidth = 820;
	// let customHeight = 360;
	let customWidth = 1920;
	let customHeight = 1080;
	let sizesVisible = false;

	$: tplWidth = customWidth + 'px';
	$: tplHeight = customHeight + 'px';
	$: tplFontSize = (customWidth / 19.25) + 'px';

	let tplWidthPreview = '0'; // Arbitrary default value overriden on load/resize
	let tplHeightPreview = '0'; // Arbitrary default value overriden on load/resize
	let tplFontSizePreview = '0'; // Arbitrary default value overriden on load/resize

	let horizontalSplit = false;

	function resizePreview(event) {
		let paddingPercentage = 10;
		let sidebarWidth = 361;
		let screenWidth = event.target.innerWidth;
		let screenHeight = event.target.innerHeight;
		horizontalSplit = screenWidth >= 960;
		let maxContainerWidth = screenWidth - (horizontalSplit ? sidebarWidth : 0);
		let maxContainerHeight = screenHeight - (horizontalSplit ? 0 : (screenHeight / 2));
		// Add padding
		maxContainerWidth = maxContainerWidth - paddingPercentage / 100 * maxContainerWidth;
		let newWidth = maxContainerWidth;
		let newHeight = maxContainerWidth / (customWidth / customHeight);
		let newFontSize = maxContainerWidth / 19.25;
		tplWidthPreview = '' + newWidth.toFixed(2) + 'px';
		tplHeightPreview = '' + newHeight.toFixed(2) + 'px';
		tplFontSizePreview = '' + newFontSize.toFixed(2) + 'px';
	}

	window.addEventListener("resize", resizePreview);
	window.dispatchEvent(new Event('resize'));

	function showSizes() {
		sizesVisible = true;
	}

	function changeSize(name, w, h) {
		sizesVisible = false;
		templateName = name;
		customWidth = w;
		customHeight = h;
		window.dispatchEvent(new Event('resize'));
	}

	function renderCanvas() {
		let element = document.getElementById("canvasSource");
		html2canvas(element, {
			width: customWidth,
			height: customHeight,
			windowWidth: customWidth,
			windowHeight: customHeight,
			allowTaint: false,
			useCORS: true
		}).then(function (canvas) {
			var a = document.createElement('a');
			// a.href = canvas.toDataURL();
			// a.download = title + '.png';
			a.href = canvas.toDataURL("image/jpeg", 1.0).replace("image/jpeg", "image/octet-stream");
			a.download = `${title} - ${templateName} - ${customWidth}x${customHeight}.jpg`;
			a.click();
		});
	}

</script>

<style>
	.grid {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: 50px calc(50% - 50px) 50px auto;
		grid-template-areas:
			'preview-nav'
			'preview'
			'options-nav'
			'options';
	}

	@media (min-width: 960px) {
		.grid {
			display: grid;
			grid-template-columns: auto 361px;
			grid-template-rows: 50px auto;
			grid-template-areas:
				'preview-nav options-nav'
				'preview options';
		}
	}

	.main-layout__preview-nav {
		grid-area: preview-nav;
	}

	.main-layout__preview {
		grid-area: preview;
	}

	.main-layout__options-nav {
		grid-area: options-nav;
	}

	.main-layout__options {
		grid-area: options;
	}
</style>

<div class="grid roboto xxx-montserrat gray h-100 w-100 amp-fullscreen">

	<Template
		id="canvasSource"
		isCanvasSource="true"
		width={tplWidth}
		height={tplHeight}
		fontSize={tplFontSize}
		backgroundColor={backgroundColor}
		backgroundImage="url({backgroundImageUrl})"
		color={color}
		brand={brand}
		title={title}
		dates={dates}
		sponsors={sponsors}
		sponsors2={sponsors2}
		vertical={vertical}
		dark={dark}
	/>

	<!-- FIXME: It appears that the full size canvas is NOT being resized when we change sizes.
			Use computed W x H instead? -->

	<div class="bg-white gray tc h-100 justify-center flex-column" class:db={sizesVisible} class:flex={sizesVisible} class:dn={!sizesVisible} style="position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 1000;">
		<h1 class="f3">Select a Size:</h1>
		<ul class="list pl0 ml0 center mw7 ba b--light-silver br3">
			<li class="pa3 bb b--light-silver">
				<a href="#0" class="f4 link dim dib gray" on:click={() => changeSize('Facebook Cover Photo', 820, 360)}>Facebook Cover Photo - 820px × 360px</a>
			</li>
			<li class="pa3 bb b--light-silver">
				<a href="#0" class="f4 link dim dib gray" on:click={() => changeSize('Facebook Event Cover', 1920, 1080)}>Facebook Event Cover - 1920px × 1080px</a>
			</li>
			<li class="pa3 bb b--light-silver">
				<a href="#0" class="f4 link dim dib gray" on:click={() => changeSize('Facebook Group Cover', 1640, 856)}>Facebook Group Cover - 1640px × 856px</a>
			</li>
			<li class="pa3 xxx-bb b--light-silver">
				<a href="#0" class="f4 link dim dib gray" on:click={() => changeSize('Facebook Link', 1200, 628)}>Facebook Link / Facebook Ad (Link) - 1200px × 628px</a>
			</li>
			<!-- <li class="ph3 pv2 xxx-bb b--light-silver">
				<a class="f6 link dim dib gray" on:click={() => changeSize('Facebook Post', 1200, 900)}>Facebook Post - 1200px × 900px</a>
			</li> -->
		</ul>
		<div>
			<a href="#0" class="f6 link dim br1 ba ph3 pv2 mv2 dib gray" on:click={() => sizesVisible = false}>Cancel</a>
		</div>
	</div>

	<div class="main-layout__preview-nav flex items-center justify-between h-100 bb b--moon-gray ph3">
		<div>
			<strong>{templateName}</strong>
			<br><small>{customWidth}px × {customHeight}px</small>
		</div>
		<div>
		  <a href="#0" class="f6 link dim br1 ba ph3 pv2 mv2 dib gray" on:click={showSizes}>Sizes</a>
		</div>
		<div>
			<a href="#0" class="no-underline gray dim inline-flex items-center mv2 tc br2 pv2" on:click={renderCanvas} title="Download">
				{@html icons.download}
				<span class="f6 ml2">Download</span>
			</a>
		</div>
	</div>
	<div class="main-layout__preview bg-white b--moon-gray"
		 class:bl={horizontalSplit}>
		 <div class="flex items-center justify-center flex-column h-100 bg-near-white">
			<Template
				width={tplWidthPreview}
				height={tplHeightPreview}
				fontSize={tplFontSizePreview}
				backgroundColor={backgroundColor}
				backgroundImage="url({backgroundImageUrl})"
				color={color}
				brand={brand}
				title={title}
				dates={dates}
				sponsors={sponsors}
				sponsors2={sponsors2}
				vertical={vertical}
				dark={dark}
			/>
		</div>
	</div>
	<div class="main-layout__options-nav bt bt-0-l bl-l b--moon-gray">
		<Tabs bind:activeTab={activeTab} tabs={tabs} />
	</div>
	<div
		class="main-layout__options bg-white bl-l b--moon-gray amp-scroll-y">
		<div class="fl w-100 h-100">
			{#if activeTab === 'text'}
			<div class="pa2 h-100">
				<TextEditor
					bind:brand={brand}
					bind:title={title}
					bind:dates={dates}
					bind:sponsors={sponsors}
					bind:sponsors2={sponsors2}
					bind:dark={dark}
				/>
			</div>
			{/if}
			{#if activeTab === 'graphics'}
			<div class="pa2 h-100">
				<div class="pa2 black-80">
					<TextField label="Image URL" bind:value={backgroundImageUrl}/>
					{#if backgroundImageUrl}
					<img src="{backgroundImageUrl}" class="w-50" alt="Show Logo">
					{/if}
				</div>
			</div>
			{/if}
		</div>
	</div>
</div>
