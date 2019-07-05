<script>
	import Palette from "./Palette.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import ColorSection from "./ColorSection.svelte";
	import Tabs from "./Tabs2.svelte";
	import Template from "./Template.svelte";
	import TextEditor from "./TextEditor.svelte";

	// http://tachyons.io/docs/themes/skins/
	// https://webaim.org/articles/contrast/#sc143

	// @custom-media --breakpoint-not-small screen and (min-width: 30em);
	// @custom-media --breakpoint-medium screen and (min-width: 30em) and (max-width: 60em);
	// @custom-media --breakpoint-large screen and (min-width: 60em);

	// If body has default pixel size of 16px, then:
	//	- 30em = 480px
	//	- 60em = 960px

	function parseColor(color, defaultColor) {
		if (chroma.valid(color)) {
			return chroma(color).hex();
		} else {
			return defaultColor || '#000000';
		};
	}

	function lineBreaksToHtml (str) {
		return str.replace(/(?:\\[rn]|[\r\n]+)+/g, '<br>').replace('\r\n', '<br>');
	}

	function fixLineBreaks (str) {
		return str.replace('\r\n', '\r\n');
	}

	function stripHtml (str) {
		return str.replace(/(<([^>]+)>)/ig, '');
	}

	const params = new URLSearchParams(window.location.search);

	let color = parseColor(params.get("color"), "#000000");
	let backgroundColor = parseColor(params.get("bgcolor"), "#ffffff");
	let brand = params.get("brand") || 'Amelia Musical Playhouse';
	let brandsub = params.get("brandsub") || 'Presents';
	let title = params.get("title") || '';
	let dates = params.get("dates") || '';
	let billing = lineBreaksToHtml(stripHtml(params.get("billing") || ''));
	let licensing = params.get("licensing") || '';
	let sponsors = stripHtml(params.get("sponsors") || '');

	let activeTab = "colors";
	let tabs = [
		{ id: "colors", title: "Colors"},
		{ id: "text", title: "Text"},
		{ id: "graphics", title: "Graphics"}
	];

	const minContrast = 4.5;

	let colors = [];
	let getScale = (arr) => {
		return chroma.scale(arr).mode('lab').colors(11);
	};
	colors = colors.concat(getScale(['000000', 'ffffff']));
	colors = colors.concat(getScale(['8B4513', 'fef9f6']));
	colors = colors.concat(getScale(['d5008f', 'ff41b4', 'ff80cc', 'ffa3d7', 'fff5fb']));
	colors = colors.concat(getScale(['e7040f', 'ff4136', 'ff725c', 'fff5f5']));
	colors = colors.concat(getScale(['ff6300', 'ffb700', 'ffd700', 'fbf1a9', 'fffceb']));
	colors = colors.concat(getScale(['ffff00', 'fffff5']));
	colors = colors.concat(getScale(['137752', '19a974', '9eebcf', 'e8fdf5']));
	colors = colors.concat(getScale(['001b44', '00449e', '357edd', '96ccff', 'cdecff', 'f6fffe']));
	colors = colors.concat(getScale(['5e2ca5', 'a463f2', 'f9f6fe']));

	$: currentContrast = chroma.contrast(color, backgroundColor);

	$: currentContrastOK = currentContrast >= minContrast;

	$: combinationsForSelectedBackgroundColor = (colors
		.filter(c => chroma.contrast(c, backgroundColor) >= minContrast))
		.map(c => { return { color: c, backgroundColor: backgroundColor }; });

	$: combinationsForSelectedTextColor = (colors
		.filter(c => chroma.contrast(c, color) >= minContrast))
		.map(c => { return { color: color, backgroundColor: c }; });

	function changeCombination(event) {
		color = parseColor(event.target.style.color);
		backgroundColor = parseColor(event.target.style.backgroundColor);
	}

	function changeColor(event) {
		color = parseColor(event.target.style.backgroundColor);
	}

	function changeBackgroundColor(event) {
		backgroundColor = parseColor(event.target.style.backgroundColor);
	}

	// FIXME: THIS CODE IS GETTING MESSY!

	let customWidth = 1920;
	let customHeight = 1080;
	// let customWidth = 385;
	// let customHeight = 216;

	let tplWidth = customWidth + 'px';
	let tplHeight = customHeight + 'px';
	let tplFontSize = (customWidth / 19.25) + 'px';

	let tplWidthPreview = '0'; // Arbitrary default value overriden on load/resize
	let tplHeightPreview = '0'; // Arbitrary default value overriden on load/resize
	let tplFontSizePreview = '0'; // Arbitrary default value overriden on load/resize

	let horizontalSplit = false;

	// let activeColorSection = "cs-bg-color";
	let activeColorSection = "";
    function toggleExpanded(id) {
		if (activeColorSection === id) {
			activeColorSection = '';
		} else {
			activeColorSection = id;
		}
    }

	function resizePreview(event) {
		let containerWidth = event.target.innerWidth;
		horizontalSplit = containerWidth > 960;
		let padding = containerWidth > 960 ? 120 : containerWidth > 480 ? 100 : 30;
		// let optionsWidth = containerWidth / 2;
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

</script>

<style>
	button {
		cursor: pointer;
	}

	/* .grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto;
		grid-template-areas:
			'options preview';
	} */

	/* .grid {
		display: grid;
		grid-template-columns: 360px auto;
		grid-template-rows: auto;
		grid-template-areas:
			'options preview';
	} */

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

/* FIXME: HIDE OFF CANVAS, MAKE BIGGER - actual size */
	#canvasSource {
		/* FIXME: remove this line display: none*/
		display: none;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1000;
		margin: auto auto;
	}
</style>

<div class="grid sans-serif gray h-100 w-100" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
	<div class="main-layout__preview-nav flex items-center justify-between h-100 bb b--moon-gray ph3">
		<div>
			<strong>Facebook Event Cover</strong>
			<br><small>{customWidth}px × {customHeight}px</small>
		</div>
		{#if !currentContrastOK}
		<div class="br2 dib fr bg-white fw6 gray ">Poor Contrast</div>
		{/if}
	</div>
	<div class="main-layout__preview bg-white b--moon-gray"
		 class:bl={horizontalSplit}>
		<div class="flex items-center justify-center h-100 xxx-h-auto-l">
			<!-- TODO: the wrapper div should be in the template -->
			<div
				class="shadow-5 mv3"
				style="
				width: {tplWidthPreview};
				height: {tplHeightPreview};
				color: {color};
				background-color: {backgroundColor};">
				<Template
					fontSize={tplFontSizePreview}
					color={color}
					brand={brand}
					brandsub={brandsub}
					title={title}
					dates={dates}
					billing={billing}
					licensing={licensing}
					sponsors={sponsors}
				/>
			</div>
			<div
				id="canvasSource"
				class="shadow-5 mv3"
				style="
				width: {tplWidth};
				height: {tplHeight};
				color: {color};
				background-color: {backgroundColor};">
				<Template
					fontSize={tplFontSize}
					color={color}
					brand={brand}
					brandsub={brandsub}
					title={title}
					dates={dates}
					billing={billing}
					licensing={licensing}
					sponsors={sponsors}
				/>
			</div>
		</div>
	</div>
	<div class="main-layout__options-nav bt bt-0-l bl-l b--moon-gray">
		<Tabs bind:activeTab={activeTab} tabs={tabs} />
	</div>
	<div
		class="main-layout__options bg-white bl-l b--moon-gray"
		style="overflow-y: auto;">
		<div class="fl w-100 h-100">
			{#if activeTab === 'colors'}
			<div class="xpa2 h-100">
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
					bind:billing={billing}
					bind:licensing={licensing}
					bind:sponsors={sponsors}
				/>
			</div>
			{/if}
		</div>
	</div>
</div>
