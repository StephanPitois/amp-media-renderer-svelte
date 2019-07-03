<script>
	import Palette from "./Palette.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import ColorSection from "./ColorSection.svelte";
	import Tabs from "./Tabs2.svelte";
	import Template from "./Template.svelte";
	import TextEditor from "./TextEditor.svelte";

	// http://tachyons.io/docs/themes/skins/
	// https://webaim.org/articles/contrast/#sc143

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

	let tplWidth = '385px';
	let tplHeight = '216px';
	let tplFontSize = '20px';

	function resizePreview(event) {
		console.log(event.target.innerWidth);
		let newWidth = event.target.innerWidth / 2 - 40;
		let newHeight = newWidth / 1.77777777778;
		let newFontSize = newWidth / 19.25;
		tplWidth = '' + newWidth.toFixed(2) + 'px';
		tplHeight = '' + newHeight.toFixed(2) + 'px';
		tplFontSize = '' + newFontSize.toFixed(2) + 'px';
		console.log(tplFontSize);
	}

	window.addEventListener("resize", resizePreview);

	window.dispatchEvent(new Event('resize'));

</script>

<style>
	button {
		cursor: pointer;
	}
</style>

<div class="sans-serif gray w-100" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
	<div class="fn fl-ns w-50-ns h-100">
		<header class="pv2 ph3 bb b--moon-gray">
			Options
		</header>
		<div class="h-100 pb5" style="overflow-y: auto">
			<Tabs bind:activeTab={activeTab} tabs={tabs} />
			<div class="fl w-100 h-100">
				{#if activeTab === 'colors'}
				<div class="pa2 h-100">
					<ColorSection
						title="Background"
						bind:color={backgroundColor}
						colors={colors}
						combinations={combinationsForSelectedBackgroundColor}
						changeColor={changeBackgroundColor}
						changeCombination={changeCombination}
					/>
					<ColorSection
						title="Text"
						bind:color={color}
						colors={colors}
						combinations={combinationsForSelectedTextColor}
						changeColor={changeColor}
						changeCombination={changeCombination}
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
	<div class="fn fl-ns w-50-ns h-100 bl-ns b--moon-gray">
		<header class="pv2 ph3 bb b--moon-gray">
			Preview
		</header>
		<div class="h-100 pb5" style="overflow-y: auto">
			{#if !currentContrastOK}
				<div class="xfl w-100 pa3">
					<div class="flex items-center justify-center pa4 bg-lightest-blue navy">
					<span class="lh-title ml3">
						<strong>Warning!</strong>
						The contrast is too low ({currentContrast.toFixed(2)}:1).
						A minimum contrast of 4.5:1 is recommended to ensure that the text is still readable against the background color.
						Hint: use one of the suggested color combinations.
					</span>
					</div>
				</div>
			{/if}
			<div class="pa2 h-100">
				<div
					class="pa2 flex items-center justify-center h-100">
					<div class="shadow-5" style="
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
		</div>
	</div>
</div>
