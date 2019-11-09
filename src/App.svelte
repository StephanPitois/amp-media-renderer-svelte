<script>
    import JSZip from "../lib/jszip.min.js";
    import saveAs from "../lib/FileSaver.min.js";

    import { onMount, tick } from "svelte";

    import config from "./config.js";
    import icons from "./icons.js";
    import utils from "./utils.js";

    import Tabs from "./Tabs.svelte";
    import Template from "./Template.svelte";
    import TextEditor from "./TextEditor.svelte";
    import TextField from "./TextField.svelte";
    import MultipleChoiceQuestion from "./MultipleChoiceQuestion.svelte";

    // http://tachyons.io/docs/themes/skins/
    // @custom-media --breakpoint-not-small screen and (min-width: 30em);
    // @custom-media --breakpoint-medium screen and (min-width: 30em) and (max-width: 60em);
    // @custom-media --breakpoint-large screen and (min-width: 60em);

    // If body has default pixel size of 16px, then:
    //	- 30em = 480px
    //	- 60em = 960px

    const params = new URLSearchParams(window.location.search);

    let dark = true;

    $: color = dark ? "#FFFFFF" : "#202020";
    $: backgroundColor = dark ? "#202020" : "#FFFFFF";

    let title = params.get("title");
    let dates = params.get("dates");
    let brand = params.get("brand") || config.defaultBrand;

    let sponsors = utils.stripHtml(params.get("sponsors") || "");
    if (sponsors) {
        sponsors = "Sponsored by " + sponsors;
    }
    let sponsors2 = "";

    // See also _redirects
    let backgroundImageUrl =
        (params.get("bgimage") || "").replace(
        "https://www.ameliamusicalplayhouse.com/wp-content",
        ""
        ) || config.defaultImage;

    let activeTab = "text";
    let tabs = [
        { id: "text", title: "Text" },
        { id: "graphics", title: "Graphics" }
    ];

    let sizes = [
        { name: "Facebook Cover Photo", width: 820, height: 360 },
        { name: "Facebook Event Cover", width: 1920, height: 1080 },
        { name: "Facebook Group Cover", width: 1640, height: 856 },
        { name: "Facebook Link / Ad", width: 1200, height: 628 },
        // { name: "Facebook Post", width: 1200, height: 900 },
        { name: "Instagram Post", width: 1080, height: 1080 },
        // { name: 'Instagram Story', width: 1080, height: 1920 },
        { name: "Twitter Header", width: 1500, height: 500 },
        { name: "Twitter Post", width: 1024, height: 512 }
    ];
    let possibleSizes = sizes.map((size, index) => {
        return {
            id: index,
            text: `${size.name} - ${size.width}px × ${size.height}px`
        };
    });
    let selectSizeVisible = false;
    let selectedSizeIndex = 1; // Facebook Event Cover
    let selectedSize = sizes[selectedSizeIndex];

    let possibleDownloadOptions = [
        { id: 0, text: "Selected Size Only / JPEG File" },
        { id: 1, text: "All Available Sizes / ZIP File" }
    ];
    let selectDownloadOptionVisible = false;

    $: tplWidth = selectedSize.width + "px";
    $: tplHeight = selectedSize.height + "px";
    $: tplFontSize = selectedSize.width / 19.25 + "px";

    let tplWidthPreview = "0"; // Arbitrary default value overriden on load/resize
    let tplHeightPreview = "0"; // Arbitrary default value overriden on load/resize
    let tplFontSizePreview = "0"; // Arbitrary default value overriden on load/resize

    let horizontalSplit = false;

    function resizePreview(event) {
        let paddingPercentage = 10;
        let sidebarWidth = 361;
        let screenWidth = event.target.innerWidth;
        let screenHeight = event.target.innerHeight;
        horizontalSplit = screenWidth >= 960;
        let maxContainerWidth = screenWidth - (horizontalSplit ? sidebarWidth : 0);
        let maxContainerHeight = screenHeight - (horizontalSplit ? 0 : screenHeight / 2);
        // Add padding
        maxContainerWidth = maxContainerWidth - (paddingPercentage / 100) * maxContainerWidth;
        maxContainerHeight = maxContainerHeight - (paddingPercentage / 100) * maxContainerHeight;
        // Calculate preview size
        let newWidth = maxContainerWidth;
        let newHeight = maxContainerWidth / (selectedSize.width / selectedSize.height);
        let newFontSize = maxContainerWidth / 19.25;
        // But if height is too big, flip calculation
        if (newHeight > maxContainerHeight) {
            newWidth = maxContainerHeight;
            newHeight = maxContainerHeight / (selectedSize.width / selectedSize.height);
            newFontSize = maxContainerHeight / 19.25;
        }
        tplWidthPreview = "" + newWidth.toFixed(2) + "px";
        tplHeightPreview = "" + newHeight.toFixed(2) + "px";
        tplFontSizePreview = "" + newFontSize.toFixed(2) + "px";
    }

    window.addEventListener("resize", resizePreview);

    function refreshPreview(arg) {
        if (typeof arg === "number") {
            selectedSizeIndex = arg;
            selectedSize = sizes[selectedSizeIndex];
        } else if (arg /* event */) {
            let event = arg;
            selectedSizeIndex = event.detail.selectedAnswerId;
            selectedSize = sizes[selectedSizeIndex];
        }
        window.dispatchEvent(new Event("resize"));
    }

    function navigateSizes(step) {
        // TODO: Quick and dirty - Only works it step is 1 or -1
        // TODO: also, the nav buttons should be links to correct sizes instead. Much easier to handle nav this way.
        if (selectedSizeIndex + step >= sizes.length) {
            refreshPreview(0);
        } else if (selectedSizeIndex + step < 0) {
            refreshPreview(sizes.length - 1);
        } else {
            refreshPreview(selectedSizeIndex + step);
        }
    }

    function startDownload(event) {
        console.log(event.detail.selectedAnswerId);
        if (event.detail.selectedAnswerId === 0) {
            // Selected Size Only / JPEG File
            downloadSingleSize();
        } else {
            // All Available Sizes / ZIP File
            downloadAllSizes();
        }
    }

    function downloadSingleSize() {
        // SINGLE GRAPHIC
        let element = document.getElementById("canvasSource");
        html2canvas(element, {
            width: selectedSize.width,
            height: selectedSize.height,
            windowWidth: selectedSize.width,
            windowHeight: selectedSize.height,
            allowTaint: false,
            useCORS: true
        }).then(function(canvas) {
            var a = document.createElement('a');
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            a.download = `${title} - ${selectedSize.name} - ${selectedSize.width}x${selectedSize.height}.jpg`;
            a.click();
        });
    }

    function downloadAllSizes() {
        // MULTIPLE GRAPHICS IN ZIP ARCHIVE
        var zip = new JSZip();
        // TODO: add date, tool author... etc...
        zip.file(
            "README.txt",
            `Amelia Musical Playhouse\n\nGraphics for: ${title}\n`
        );

        let genFilesRecursive = async index => {
            refreshPreview(index);
            await tick(); // <-- VERY important to allow the graphic to be resized
            let element = document.getElementById("canvasSource");
            html2canvas(element, {
                width: selectedSize.width,
                height: selectedSize.height,
                windowWidth: selectedSize.width,
                windowHeight: selectedSize.height,
                allowTaint: false,
                useCORS: true
            }).then(function(canvas) {
                canvas.toBlob(function(blob) {
                let filename = `${title} - ${selectedSize.name.replace("/", "")} - ${selectedSize.width}x${selectedSize.height}.jpg`;
                zip.file(filename, blob, { base64: true });
                // Next iteration:
                let nextIndex = index + 1;
                if (nextIndex < sizes.length) {
                    genFilesRecursive(nextIndex);
                } else {
                    refreshPreview(indexBackup); // <-- Restore current index
                    zip.generateAsync({ type: "blob" }).then(function(content) {
                        // see FileSaver.js
                        saveAs(content, `${title} - Graphics.zip`);
                    });
                }
                });
            });
        };
        let indexBackup = selectedSizeIndex; // <-- Back up current index
        genFilesRecursive(0);
    }

    onMount(() => {
        refreshPreview();
    });

    function handleKeydown(e) {
        // TODO: this should be more generic
        if (e.key === "Escape") {
            selectSizeVisible = false;
            selectDownloadOptionVisible = false;
        }
    }
</script>

<style>
    .grid {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: 50px calc(50% - 50px) 50px auto;
        grid-template-areas:
            "preview-nav"
            "preview"
            "options-nav"
            "options";
    }
    @media (min-width: 960px) {
        .grid {
            display: grid;
            grid-template-columns: auto 361px;
            grid-template-rows: 50px auto;
            grid-template-areas:
                "preview-nav options-nav"
                "preview options";
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

<svelte:window on:keydown={handleKeydown} />

<div class="grid roboto gray h-100 w-100 amp-fullscreen">
    <!-- SELECT A SIZE -->
    <MultipleChoiceQuestion
        questionText="Select a Size:"
        possibleAnswers={possibleSizes}
        highlightedAnswerId={selectedSizeIndex}
        bind:visible={selectSizeVisible}
        on:answerSelected={refreshPreview} />

    <!-- SELECT A DOWNLOAD OPTIONS -->
    <MultipleChoiceQuestion
        questionText="Select a Download Option:"
        possibleAnswers={possibleDownloadOptions}
        bind:visible={selectDownloadOptionVisible}
        on:answerSelected={startDownload} />

    <!-- FULL SIZE TEMPLATE -->
    <Template
        id="canvasSource"
        isCanvasSource="true"
        width={tplWidth}
        height={tplHeight}
        fontSize={tplFontSize}
        {backgroundColor}
        backgroundImage="url({backgroundImageUrl})"
        {color}
        {brand}
        {title}
        {dates}
        {sponsors}
        {sponsors2}
        {dark} />

    <!-- TEMPLATE PREVIEW -->
    <div
        class="main-layout__preview-nav flex items-center justify-between h-100 bb b--moon-gray ph3">
        <div class="w-33 truncate">
            <strong>{selectedSize.name}</strong>
            <br />
            <small>{selectedSize.width}px × {selectedSize.height}px</small>
        </div>
        <div class="w-34 flex items-center justify-center">
            <a
                href="#0"
                class="dn flex-m flex-l items-center justify-center f6 link dim br-100 ba w2 h2 mh1 gray bg-white"
                on:click={() => navigateSizes(-1)}>
                {@html icons.chevronLeft}
            </a>
            <a
                href="#0"
                class="f6 link dim br1 ba ph3 pv2 mv2 dib gray"
                on:click={() => (selectSizeVisible = true)}>
                Sizes
            </a>
            <a
                href="#0"
                class="dn flex-m flex-l items-center justify-center f6 link dim br-100 ba w2 h2 mh1 gray bg-white"
                on:click={() => navigateSizes(1)}>
                {@html icons.chevronRight}
            </a>
        </div>
        <div class="w-33 tr">
            <a
                href="#0"
                class="no-underline gray dim inline-flex items-center mv2 tc br2 pv2"
                on:click={() => (selectDownloadOptionVisible = true)}
                title="Download">
                {@html icons.download}
                <span class="f6 ml2">Download</span>
            </a>
        </div>
    </div>
    <div
        class="main-layout__preview bg-white b--moon-gray"
        class:bl={horizontalSplit}>
        <div
            class="flex items-center justify-center flex-column h-100 bg-near-white">
            <Template
                width={tplWidthPreview}
                height={tplHeightPreview}
                fontSize={tplFontSizePreview}
                {backgroundColor}
                backgroundImage="url({backgroundImageUrl})"
                {color}
                {brand}
                {title}
                {dates}
                {sponsors}
                {sponsors2}
                {dark} />
        </div>
    </div>
    <div class="main-layout__options-nav bt bt-0-l bl-l b--moon-gray">
        <Tabs bind:activeTab {tabs} />
    </div>
    <div class="main-layout__options bg-white bl-l b--moon-gray amp-scroll-y">
        <div class="fl w-100 h-100">
            {#if activeTab === 'text'}
            <div class="pa2 h-100">
                <TextEditor
                    bind:brand
                    bind:title
                    bind:dates
                    bind:sponsors
                    bind:sponsors2
                    bind:dark />
            </div>
            {/if}
            {#if activeTab === 'graphics'}
            <div class="pa2 h-100">
                <div class="pa2 black-80">
                    <TextField label="Image URL" bind:value={backgroundImageUrl} />
                    {#if backgroundImageUrl}
                    <img src={backgroundImageUrl} class="w-50" alt="Show Logo" />
                    {/if}
                </div>
            </div>
            {/if}
        </div>
    </div>
</div>