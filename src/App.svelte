<script>
	import Palette from "./Palette.svelte";
	import ColorPicker from "./ColorPicker.svelte";

	// http://tachyons.io/docs/themes/skins/
	// https://webaim.org/articles/contrast/#sc143

	const minContrast = 4.5;

	let palette = [
		{ key: 'black', color: '#000000' },
		{ key: 'gray-1', color: '#111111' },
		{ key: 'gray-2', color: '#333333' },
		{ key: 'gray-3', color: '#555555' },
		{ key: 'gray-4', color: '#777777' },
		{ key: 'gray-5', color: '#999999' },
		{ key: 'gray-6', color: '#aaaaaa' },
		{ key: 'gray-7', color: '#cccccc' },
		{ key: 'gray-8', color: '#eeeeee' },
		{ key: 'gray-9', color: '#f4f4f4' },
		{ key: 'white', color: '#ffffff' },
		{ key: 'dark-red', color: '#e7040f' },
		{ key: 'red', color: '#ff4136' },
		{ key: 'light-red', color: '#ff725c' },
		{ key: 'washed-red', color: '#ffdfdf' },
		{ key: 'orange', color: '#ff6300' },
		{ key: 'gold', color: '#ffb700' },
		{ key: 'yellow', color: '#ffd700' },
		{ key: 'bright-yellow', color: '#ffff00' },
		{ key: 'light-yellow', color: '#fbf1a9' },
		{ key: 'washed-yellow', color: '#fffceb' },
		{ key: 'dark-green', color: '#137752' },
		{ key: 'green', color: '#19a974' },
		{ key: 'light-green', color: '#9eebcf' },
		{ key: 'washed-green', color: '#e8fdf5' },
		{ key: 'navy', color: '#001b44' },
		{ key: 'dark-blue', color: '#00449e' },
		{ key: 'blue', color: '#357edd' },
		{ key: 'light-blue', color: '#96ccff' },
		{ key: 'lightest-blue', color: '#cdecff' },
		{ key: 'washed-blue', color: '#f6fffe' },
		{ key: 'purple', color: '#5e2ca5' },
		{ key: 'light-purple', color: '#a463f2' },
		{ key: 'dark-pink', color: '#d5008f' },
		{ key: 'hot-pink', color: '#ff41b4' },
		{ key: 'pink', color: '#ff80cc' },
		{ key: 'light-pink', color: '#ffa3d7' }
	];
	let colors = _.map(palette, 'color');
	let color = '#000000';
	let backgroundColor = '#ffffff';

	// var extra = chroma.scale(['ff6300', 'ffff00']).mode('lab').colors(12);
	// var extra2 = chroma.scale(['ffff00', 'FFFCEB']).mode('lab').colors(12);
	// colors = colors.concat(extra);
	// colors = colors.concat(extra2);

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
		color = chroma(event.target.style.backgroundColor).hex();
	}

	function changeBackgroundColor(event) {
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
			<div class="fl w-100">
				<div class="pa2">
					<div class="fl w-50">
						<div class="pa2">
							Background Color
						</div>
						<div class="pa2">
							<ColorPicker bind:color={backgroundColor} />
						</div>
						<div class="pa2">
							<Palette colors={colors} clickHandler={changeBackgroundColor} />
						</div>
					</div>
					<div class="fl w-50">
						<div class="pa2">
							Text Color
						</div>
						<div class="pa2">
							<ColorPicker bind:color={color} />
						</div>
						<div class="pa2">
							<Palette colors={colors} clickHandler={changeColor} />
						</div>
					</div>
				</div>
			</div>
			<div class="fl w-100">
				<div class="pa2">
					<div class="fl w-50">
						<div class="pa2">
							Combinations for Background Color
						</div>
						<div class="pa2">
							<Palette combinations={combinationsForSelectedBackgroundColor} clickHandler={changeCombination} />
						</div>
					</div>
					<div class="fl w-50">
						<div class="pa2">
							Combinations for Text Color
						</div>
						<div class="pa2">
							<Palette combinations={combinationsForSelectedTextColor} clickHandler={changeCombination} />
						</div>
					</div>
				</div>
			</div>
			<div class="fl w-100 pv2 ph3">
				{#if !currentContrastOK}
					<div class="flex items-center justify-center pa4 bg-lightest-blue navy">
					<span class="lh-title ml3">
						<strong>Warning!</strong>
						The contrast is too low ({currentContrast.toFixed(2)}:1).
						A minimum contrast of 4.5:1 is recommended to ensure that the text is still readable against the background color.
						Hint: use one of the suggested color combinations.
					</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="fn fl-ns w-50-ns h-100 bl-ns b--mid-gray">
		<header class="pv2 ph3 bb b--light-gray">
			Preview
		</header>
		<div class="h-100 pb5" style="overflow-y: auto">
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
