<script>
	import config from "./config.js";
	import utils from "./utils.js";
	import icons from "./icons.js";

	import Palette from "./Palette.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import ColorSection from "./ColorSection.svelte";
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

	let color = "#FFFFFF"; // utils.parseColor(params.get("color"), config.defaultColor);
	let backgroundColor = "#202020"; // utils.parseColor(params.get("bgcolor"), config.defaultBackgroundColor);
	let backgroundAlphaPercent = params.get("bgimageopacity") || config.defaultBackgroundAlpha;
	let brand = params.get("brand") || config.defaultBrand;
	let brandsub = params.get("brandsub") || config.defaultBrandSub;
	let title = params.get("title");
	let dates = params.get("dates");
	let billingRaw = window.atob(params.get("billing") || '');
	let licensing = params.get("licensing");

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
		// { id: "colors", title: "Colors"},
		{ id: "graphics", title: "Graphics"}
	];

	let colors = [];
	colors = colors.concat(utils.getScale(['000000', 'ffffff']));
	colors = colors.concat(utils.getScale(['8B4513', 'fef9f6']));
	colors = colors.concat(utils.getScale(['d5008f', 'ff41b4', 'ff80cc', 'ffa3d7', 'fff5fb']));
	colors = colors.concat(utils.getScale(['e7040f', 'ff4136', 'ff725c', 'fff5f5']));
	colors = colors.concat(utils.getScale(['ff6300', 'ffb700', 'ffd700', 'fbf1a9', 'fffceb']));
	colors = colors.concat(utils.getScale(['ffff00', 'fffff5']));
	colors = colors.concat(utils.getScale(['137752', '19a974', '9eebcf', 'e8fdf5']));
	colors = colors.concat(utils.getScale(['001b44', '00449e', '357edd', '96ccff', 'cdecff', 'f6fffe']));
	colors = colors.concat(utils.getScale(['5e2ca5', 'a463f2', 'f9f6fe']));

	$: billing = utils.lineBreaksToHtml(utils.stripHtml(billingRaw));

	$: backgroundAlpha = (100 - backgroundAlphaPercent) / 100;

	$: currentContrast = chroma.contrast(color, backgroundColor);

	$: currentContrastOK = currentContrast >= config.minimumContrast;

	$: combinationsForSelectedBackgroundColor = (colors
		.filter(c => chroma.contrast(c, backgroundColor) >= config.minimumContrast))
		.map(c => { return { color: c, backgroundColor: backgroundColor }; });

	$: combinationsForSelectedTextColor = (colors
		.filter(c => chroma.contrast(c, color) >= config.minimumContrast))
		.map(c => { return { color: color, backgroundColor: c }; });

	function changeCombination(event) {
		color = utils.parseColor(event.target.style.color);
		backgroundColor = utils.parseColor(event.target.style.backgroundColor);
	}

	function changeColor(event) {
		color = utils.parseColor(event.target.style.backgroundColor);
	}

	function changeBackgroundColor(event) {
		backgroundColor = utils.parseColor(event.target.style.backgroundColor);
	}

	let templateName = 'Facebook Event Cover';
	// let customWidth = 2160;
	// let customHeight = 1080;
	let customWidth = 1920;
	let customHeight = 1080;
	let sizesVisible = false;

	let tplWidth = customWidth + 'px';
	let tplHeight = customHeight + 'px';
	let tplFontSize = (customWidth / 19.25) + 'px';

	let tplWidthPreview = '0'; // Arbitrary default value overriden on load/resize
	let tplHeightPreview = '0'; // Arbitrary default value overriden on load/resize
	let tplFontSizePreview = '0'; // Arbitrary default value overriden on load/resize

	let horizontalSplit = false;

	let activeColorSection = "";
    function toggleExpanded(id) {
		if (activeColorSection === id) {
			activeColorSection = '';
		} else {
			activeColorSection = id;
		}
    }

	function resizePreview(event) {
		let paddingPercentage = 10;
		let sidebarWidth = 361;
		let screenWidth = event.target.innerWidth;
		let screenHeight = event.target.innerHeight;
		horizontalSplit = screenWidth >= 960;
		// horizontalSplit = screenWidth > screenHeight;
		console.log(screenWidth);
		console.log(screenHeight);
		console.log(horizontalSplit);
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

	function resizePreview_DEPRECATED(event) {
		let containerWidth = event.target.innerWidth;
		horizontalSplit = containerWidth > 960;
		let padding = 0;
		if (vertical) {
			padding = horizontalSplit ? 480 : 120;
		}
		else {
			padding = horizontalSplit ? 120 : containerWidth > 480 ? 100 : 30;
		}
		let optionsWidth = containerWidth - 361;
		let newWidth = (horizontalSplit ? optionsWidth : containerWidth) - padding;
		let newHeight = newWidth / (customWidth / customHeight);
		let newFontSize = newWidth / 19.25;
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
			a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
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
		backgroundAlpha={backgroundAlpha}
		backgroundImage="url({backgroundImageUrl})"
		color={color}
		brand={brand}
		brandsub={brandsub}
		title={title}
		dates={dates}
		billing={billing}
		licensing={licensing}
		sponsors={sponsors}
		sponsors2={sponsors2}
		vertical={vertical}
	/>

	<!-- FIXME: It appears that the full size canvas is NOT being resized when we change sizes.
			Use computed W x H instead? -->

	<div class="bg-white gray tc" class:db={sizesVisible} class:dn={!sizesVisible} style="position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 1000;">
		<ul class="list pl0 ml0 mt5 center mw7 ba b--light-silver br3">
			<li class="ph3 pv2 bb b--light-silver">
				<a class="f6 link dim dib gray" on:click={() => changeSize('Facebook Cover Photo', 820, 360)}>Facebook Cover Photo - 820px × 360px</a>
			</li>
			<li class="ph3 pv2 bb b--light-silver">
				<a class="f6 link dim dib gray" on:click={() => changeSize('Facebook Event Cover', 1920, 1080)}>Facebook Event Cover - 1920px × 1080px</a>
			</li>
			<li class="ph3 pv2 bb b--light-silver">
				<a class="f6 link dim dib gray" on:click={() => changeSize('Facebook Group Cover', 1640, 856)}>Facebook Group Cover - 1640px × 856px</a>
			</li>
			<li class="ph3 pv2 xxx-bb b--light-silver">
				<a class="f6 link dim dib gray" on:click={() => changeSize('Facebook Link', 1200, 628)}>Facebook Link / Facebook Ad (Link) - 1200px × 628px</a>
			</li>
			<!-- <li class="ph3 pv2 xxx-bb b--light-silver">
				<a class="f6 link dim dib gray" on:click={() => changeSize('Facebook Post', 1200, 900)}>Facebook Post - 1200px × 900px</a>
			</li> -->
		</ul>
	</div>

	<div class="main-layout__preview-nav flex items-center justify-between h-100 bb b--moon-gray ph3">
		<div>
			<strong>{templateName}</strong>
			<br><small>{customWidth}px × {customHeight}px</small>
		</div>
		<div>
		  <a class="f6 link dim br1 ba ph3 pv2 mv2 dib gray" on:click={showSizes}>Sizes</a>
		</div>
		<div>
			<a class="no-underline gray dim inline-flex items-center mv2 tc br2 pv2" on:click={renderCanvas} title="Download">
				{@html icons.download}
				<span class="f6 ml2">Download</span>
			</a>
		</div>
		{#if !currentContrastOK}
		<div class="br2 dib fr bg-white fw6 dark-red">Poor contrast</div>
		{/if}
	</div>
	<div class="main-layout__preview bg-white b--moon-gray"
		 class:bl={horizontalSplit}>
		 <div class="flex items-center justify-center flex-column h-100 bg-near-white">
			<Template
				width={tplWidthPreview}
				height={tplHeightPreview}
				fontSize={tplFontSizePreview}
				backgroundColor={backgroundColor}
				backgroundAlpha={backgroundAlpha}
				backgroundImage="url({backgroundImageUrl})"
				color={color}
				brand={brand}
				brandsub={brandsub}
				title={title}
				dates={dates}
				billing={billing}
				licensing={licensing}
				sponsors={sponsors}
				sponsors2={sponsors2}
				vertical={vertical}
			/>
		</div>
	</div>
	<div class="main-layout__options-nav bt bt-0-l bl-l b--moon-gray">
		<Tabs bind:activeTab={activeTab} tabs={tabs} />
	</div>
	<div
		class="main-layout__options bg-white bl-l b--moon-gray amp-scroll-y">
		<div class="fl w-100 h-100">
			{#if activeTab === 'colors'}
			<div class="h-100">
				<ColorSection
					id="cs-bg-color"
					title="Background"
					bind:color={backgroundColor}
					colors={colors}
					combinations={combinationsForSelectedBackgroundColor}
					changeColor={changeBackgroundColor}
					changeCombination={changeCombination}
					expanded={activeColorSection === 'cs-bg-color'}
					toggleExpanded={toggleExpanded}
				/>
				<ColorSection
					id="cs-color"
					title="Text"
					bind:color={color}
					colors={colors}
					combinations={combinationsForSelectedTextColor}
					changeColor={changeColor}
					changeCombination={changeCombination}
					expanded={activeColorSection === 'cs-color'}
					toggleExpanded={toggleExpanded}
				/>
			</div>
			{/if}
			{#if activeTab === 'text'}
			<div class="pa2 h-100">
				<TextEditor
					bind:brand={brand}
					bind:brandsub={brandsub}
					bind:title={title}
					bind:dates={dates}
					bind:billing={billingRaw}
					bind:licensing={licensing}
					bind:sponsors={sponsors}
					bind:sponsors2={sponsors2}
				/>
			</div>
			{/if}
			{#if activeTab === 'graphics'}
			<div class="pa2 h-100">
				<div class="pa2 black-80">
					<!-- <div>
						<label for="bg-alpha-input" class="f6 b db mb2">Image Opacity: {backgroundAlphaPercent}%</label>
						<div id="bg-alpha-input" class="mb3">
							<label>
								<input class="w-100 mt2" type=range bind:value={backgroundAlphaPercent} min=0 max=100>
							</label>
						</div>
					</div> -->
					<TextField label="Image URL" bind:value={backgroundImageUrl}/>
					{#if backgroundImageUrl}
					<img src="{backgroundImageUrl}" class="w-50">
					{/if}
				</div>
			</div>
			{/if}
		</div>
	</div>
</div>
