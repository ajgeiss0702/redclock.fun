<script>
    import {capitalize} from "$lib/utils";
    import {browser} from "$app/environment";

    export let layout;
    export let activeLayout;
    export let useIframe;
</script>
<style>
    div {
        display: inline-block;
    }
    img {
        max-width: 100%;
        max-height: 100%;
    }
    .wrapper {
        border: 3px solid rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        margin: 0.5em;
        padding: 1em;

        cursor: pointer;
    }
    :global(.dark) .wrapper {
        border-color: rgba(255, 255, 255, 0.5);
    }
    .preview {
        width: 25vw;
        height: 25vh;
    }
    iframe {
        width: 100vw;
        height: 100vh;
        transform: scale(25%);
        position: absolute;
        margin: -38vh -37.5vw;
    }
</style>
<button class="hidden-button wrapper" on:click>
    <div class="preview layout-preview layout-preview-{layout}">
        {#if browser && useIframe}
            <iframe src="/countdown?layout={layout}" title={layout}></iframe>
        {:else if browser}
            <img src="/img/layouts/{layout}-{window.getThemeName()}.png" alt="{capitalize(layout)} layout">
        {/if}
    </div>
    <br>
    <span class="selectable" class:selected={browser && activeLayout === layout}>
        {capitalize(layout)}
    </span>
</button>