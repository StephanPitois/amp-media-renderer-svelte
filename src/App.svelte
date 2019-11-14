<!-- FIXME: FIXME: FIXME: FIXME: FIXME: FIXME: FIXME: FIXME:

    Known bugs:

    - Some tachyons ratios are referenced but not fully implemented or something like that, causing
      images to be disaplyed at the wrong size. Solution: add missing CSS classes to template for
      those ratios with correct percentages

    - When generating multiple graphics, if the current image is not image index 0, image 0
      will be missing from the batch. At least that's what it looks like. Not sure ho to fix
      this. Maybe refresh after switching to 0 - or move to 0 before starting the batch?

    - Multi ratios not supported for templates other than square / Instagram

-->

<script>
    import JSZip from "../lib/jszip.min.js";
    import saveAs from "../lib/FileSaver.min.js";

    import { onMount, tick } from "svelte";

    import config from "./config.js";
    import icons from "./icons.js";
    import utils from "./utils.js";
    import data from "./data.js";

    import Tabs from "./Tabs.svelte";
    import Template from "./Template.svelte";
    import TextEditor from "./TextEditor.svelte";
    import TextField from "./TextField.svelte";
    import MultipleChoiceQuestion from "./MultipleChoiceQuestion.svelte";
    import Loader from "./Loader.svelte";

    // http://tachyons.io/docs/themes/skins/
    // @custom-media --breakpoint-not-small screen and (min-width: 30em);
    // @custom-media --breakpoint-medium screen and (min-width: 30em) and (max-width: 60em);
    // @custom-media --breakpoint-large screen and (min-width: 60em);

    // If body has default pixel size of 16px, then:
    //	- 30em = 480px
    //	- 60em = 960px

    let dark = true;

    $: color = dark ? "#FFFFFF" : "#202020";
    $: backgroundColor = dark ? "#202020" : "#FFFFFF";

    let brand = config.defaultBrand;
    let title = "";
    let dates = "";
    let sponsors = "";
    let sponsors2 = "";
    let backgroundImageUrl = config.defaultImage; // See also _redirects
    let imageUrls = [];
    let imageSizes = [];

    let backgroundImageWidth = 1;
    let backgroundImageHeight = 1;
    $: {
        let size = imageSizes[backgroundImageUrl];
        if (size) {
            backgroundImageWidth = size.w;
            backgroundImageHeight = size.h;
        }
    }

    let activeTab = "text";
    let tabs = [
        { id: "text", title: "Text" },
        { id: "images", title: "Images" }
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
    let selectedSizeIndex = 4; // Instagram Post
    let selectedSize = sizes[selectedSizeIndex];

    let possibleDownloadOptions = [
        { id: 0, text: "Current Image + Current Size / JPEG File" },
        { id: 1, text: "Current Image + All Sizes / ZIP File" },
        { id: 2, text: "All Images + Current Size / ZIP File" },
        { id: 3, text: "All Images + All Sizes / ZIP File" }
    ];
    let selectDownloadOptionVisible = false;

    let loaderVisible = true;
    let loaderText = "Loading . . . Please Wait";

    $: tplWidth = selectedSize.width + "px";
    $: tplHeight = selectedSize.height + "px";
    $: tplFontSize = selectedSize.width / 19.25 + "px";

    let tplWidthPreview = "0"; // Arbitrary default value overriden on load/resize
    let tplHeightPreview = "0"; // Arbitrary default value overriden on load/resize
    let tplFontSizePreview = "0"; // Arbitrary default value overriden on load/resize

    let horizontalSplit = false;

    window.addEventListener("resize", resizePreview);

    data.load()
        .fail(function (jqXHR, textStatus, errorThrown) {
            loaderText = `${jqXHR.status} - ${jqXHR.statusText} - ${jqXHR.responseJSON.message}`;
        })
        .done(d => {

            let options = data.convert(d);

            title = options.productionTitle;
            dates = options.dates;

            sponsors = utils.stripHtml(options.sponsoredBy || "");
            if (sponsors) {
                sponsors = "Sponsored by " + sponsors;
            }
            sponsors2 = "";

            imageUrls = options.imageUrls || [];
            backgroundImageUrl = imageUrls[0] || config.defaultImage;

            loaderText = "Fetching Image Data . . .";
            let steps = imageUrls.length;

            // Fetch all image sizes now for better experience later and correct rendering of downloads
            for (let i = 0; i < imageUrls.length; i++) {
                let url = imageUrls[i];
                let img = new Image();
                jQuery(img).on('load', function() {
                    if (img.width !== 0 && img.height !== 0) {
                        imageSizes[url] = {
                            w: img.width,
                            h: img.height
                        };
                    }
                    steps--;
                    if (steps <= 0) {
                        loaderVisible = false;
                        loaderText = "";
                    }
                });
                img.src = url.replace(/url\(|\)$/ig, '');
            }

        });

    onMount(() => {
        refreshPreview();
    });

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
        if (event.detail.selectedAnswerId === 0) {
            // Current Image + Current Size / JPEG File
            downloadSingleGraphic();
        } else if (event.detail.selectedAnswerId === 1) {
            // Current Image + All Sizes / ZIP File
            downloadMultipleGraphics({ images: 'current-image', sizes: 'all-sizes'});
        } else if (event.detail.selectedAnswerId === 2) {
            // All Images + Current Size / ZIP File
            downloadMultipleGraphics({ images: 'all-images', sizes: 'current-size'});
        } else if (event.detail.selectedAnswerId === 3) {
            // All Images + All Sizes / ZIP File
            downloadMultipleGraphics({ images: 'all-images', sizes: 'all-sizes'});
        } else {
            window.alert("Not implemented");
        }
    }

    function downloadSingleGraphic() {
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
            let a = document.createElement('a');
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            a.download = `${title} - ${selectedSize.name} - ${selectedSize.width}x${selectedSize.height}.jpg`;
            a.click();
        });
    }

    function downloadMultipleGraphics(downloadMultipleGraphicsOptions) {

        downloadMultipleGraphicsOptions = downloadMultipleGraphicsOptions || {};
        downloadMultipleGraphicsOptions.sizes = downloadMultipleGraphicsOptions.sizes || 'all-sizes';
        downloadMultipleGraphicsOptions.images = downloadMultipleGraphicsOptions.images || 'all-images';

        let sizesToDownload =
            downloadMultipleGraphicsOptions.sizes === 'all-sizes'
            ? sizes.map((size, index) => index)
            : [selectedSizeIndex];

        let imagesToDownload =
            downloadMultipleGraphicsOptions.images === 'all-images'
            ? imageUrls.map((imageUrl, index) => index)
            : [imageUrls.indexOf(backgroundImageUrl) || -1];

        let hasImages = imagesToDownload.length > 0;

        // Create list of all sizes, all images that we are going to download
        let graphics = [];
        for (let sizesToDownloadIndex = 0; sizesToDownloadIndex < sizesToDownload.length; sizesToDownloadIndex++) {
            let sizeIndex = sizesToDownload[sizesToDownloadIndex];
            if (hasImages) {
                for (let imagesToDownloadIndex = 0; imagesToDownloadIndex < imagesToDownload.length; imagesToDownloadIndex++) {
                    let imageUrlIndex = imagesToDownload[imagesToDownloadIndex];
                    graphics.push({
                        sizeIndex: sizeIndex,
                        imageUrlIndex: imageUrlIndex,
                        imageUrl: imageUrlIndex > 0 ? imageUrls[imageUrlIndex] : config.defaultImage
                    });
                }
            } else {
                graphics.push({
                    sizeIndex: sizeIndex,
                    imageUrlIndex: -1,
                    imageUrl: config.defaultImage
                });
            }
        }

        // MULTIPLE GRAPHICS IN ZIP ARCHIVE
        let zipFilename = `${title} - Graphics.zip`;
        let zip = new JSZip();
        zip.file("README.txt", `Amelia Musical Playhouse\n\nGraphics for: ${title}\n`);

        // Note: index is a valid index of the graphics array
        let genFilesRecursive = async index => {
            let graphic = graphics[index];
            refreshPreview(graphic.sizeIndex);
            await tick(); // <-- VERY important to allow the graphic to be resized
            let filename = `${title} - ${selectedSize.name.replace("/", "")} - ${selectedSize.width}x${selectedSize.height} - Image ${graphic.imageUrlIndex}.jpg`;
            loaderText = `Generating "${filename}" . . .`;
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
                zip.file(filename, blob, { base64: true });
                // Next iteration:
                let nextIndex = index + 1;
                if (nextIndex < graphics.length) {
                    backgroundImageUrl = graphics[nextIndex].imageUrl;
                    genFilesRecursive(nextIndex);
                } else {
                    loaderText = `Generating "${zipFilename}" . . .`;
                    zip.generateAsync({ type: "blob" }).then(function(content) {
                        // see FileSaver.js
                        saveAs(content, zipFilename);
                        backgroundImageUrl = imageBackup // <-- Restore image
                        refreshPreview(indexBackup); // <-- Restore index
                        loaderVisible = false;
                    });
                }
                });
            });
        };
        loaderVisible = true;
        let indexBackup = selectedSizeIndex; // <-- Back up current index
        let imageBackup = backgroundImageUrl; // <-- Back up current index

        // start with graphics index 0:
        backgroundImageUrl = graphics[0].imageUrl;
        genFilesRecursive(0);
    }

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

    <!-- LOADER -->
    <Loader
        text={loaderText}
        bind:visible={loaderVisible} />

    <!-- FULL SIZE TEMPLATE -->
    <Template
        id="canvasSource"
        isCanvasSource="true"
        width={tplWidth}
        height={tplHeight}
        fontSize={tplFontSize}
        {backgroundColor}
        backgroundImage="url({backgroundImageUrl})"
        {backgroundImageWidth}
        {backgroundImageHeight}
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
                on:click|preventDefault={() => navigateSizes(-1)}>
                {@html icons.chevronLeft}
            </a>
            <a
                href="#0"
                class="f6 link dim br1 ba ph3 pv2 mv2 dib gray"
                on:click|preventDefault={() => (selectSizeVisible = true)}>
                Sizes
            </a>
            <a
                href="#0"
                class="dn flex-m flex-l items-center justify-center f6 link dim br-100 ba w2 h2 mh1 gray bg-white"
                on:click|preventDefault={() => navigateSizes(1)}>
                {@html icons.chevronRight}
            </a>
        </div>
        <div class="w-33 tr">
            <a
                href="#0"
                class="no-underline gray dim inline-flex items-center mv2 tc br2 pv2"
                on:click|preventDefault={() => (selectDownloadOptionVisible = true)}
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
                {backgroundImageWidth}
                {backgroundImageHeight}
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
            {#if activeTab === 'images'}
            <div class="pa2 h-100">
                <div class="pa2 black-80 flex flex-wrap jusify-between">
                    {#each imageUrls as imageUrl}
                        <div
                            class="w-25 pa1" >
                            <img
                                src={imageUrl}
                                alt="Show Logo"
                                class="cursor-pointer bb bw4"
                                class:b--white={backgroundImageUrl !== imageUrl}
                                class:b--blue={backgroundImageUrl === imageUrl}
                                on:click|preventDefault={() => backgroundImageUrl = imageUrl} />
                        </div>
                    {/each}
                </div>
            </div>
            {/if}
        </div>
    </div>
</div>
