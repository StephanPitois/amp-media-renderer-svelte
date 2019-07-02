<script>
	import Palette from "./Palette.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import ColorSection from "./ColorSection.svelte";

	// http://tachyons.io/docs/themes/skins/
	// https://webaim.org/articles/contrast/#sc143

	const minContrast = 4.5;

	let color = '#000000';
	let backgroundColor = '#ffffff';

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
		color = chroma(event.target.style.color).hex();
		backgroundColor = chroma(event.target.style.backgroundColor).hex();
	}

	function changeColor(event) {
		// TODO: FIXME: fix error when typing hex code in input box
		color = chroma(event.target.style.backgroundColor).hex();
	}

	function changeBackgroundColor(event) {
		// TODO: FIXME: fix error when typing hex code in input box
		backgroundColor = chroma(event.target.style.backgroundColor).hex();
	}

</script>

<style>
	button {
		cursor: pointer;
	}
</style>

<div class="sans-serif gray w-100" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
	<div class="fn fl-ns w-50-ns h-100">
		<header class="pv2 ph3 bb b--light-gray">
			Options
		</header>
		<div class="h-100 pb5" style="overflow-y: auto">
			<div class="fl w-100 h-100">
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
			</div>
		</div>
	</div>
	<div class="fn fl-ns w-50-ns h-100 bl-ns b--mid-gray">
		<header class="pv2 ph3 bb b--light-gray">
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
			<div class="pa2">
				<div class="pa2">
					<div class="shadow-5" style="
						width: 385px;
						height: 216px;
						color: {color};
						background-color: {backgroundColor};">
						<div class="pa4 tc w-100">Text Sample</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
