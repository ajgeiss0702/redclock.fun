<script lang="ts">
    import {onMount} from "svelte";
    import {getAPIPrefix} from "$lib/utils.js";
    import LoadingText from "$lib/LoadingText.svelte";
    import ClipboardCheck from "svelte-bootstrap-icons/lib/ClipboardCheck.svelte"
    import ArrowClockwise from "svelte-bootstrap-icons/lib/ArrowClockwise.svelte"
    import Clipboard from "svelte-bootstrap-icons/lib/Clipboard.svelte"
    import {PopupSettings, popup} from "@skeletonlabs/skeleton";

    export let initialQuote = undefined;
    export let withButtons = true;
    export let shouldFetch = true;

    type Quote = {
        quote: string,
        author: string,
        quoteNumber: number
    }

    let quote: Promise<Quote> = new Promise(() => {});
    $: if(initialQuote) quote = Promise.resolve(initialQuote);

    let copied = false;

    let reloadButton;

    onMount(() => {
        if(shouldFetch) fetchQuote()
    });

    function fetchQuote() {
        if(!shouldFetch) return;
        reloadButton.classList.add("rotate");
        let fetchingQuote = fetch(
            getAPIPrefix() + "/api/quotes/get",
            {
                cache: "no-cache"
            }
        ).then(r => r.json());
        fetchingQuote.then(() => {
            quote = fetchingQuote;
            reloadButton.classList.remove("rotate");
        })
    }

    let copyTimeout;
    async function copy() {
        let quoteObject = await quote;
        navigator.clipboard.writeText(quoteObject.quote + " —" + quoteObject.author).then(() => {
            copied = true;
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => copied = false, 2e3);
        })
    }

    let copyHoverSettings: PopupSettings = {
        event: 'hover',
        target: 'copyHover',
        placement: 'bottom'
    }

    let reloadHoverSettings: PopupSettings = {
        event: 'hover',
        target: 'reloadHover',
        placement: 'bottom'
    }
</script>
<style>
    .quote-box {
        display: inline-block;
        padding: 0.5em;
        max-width: 80%;
        border-style: solid;
        border-radius: 1em;
        border-width: initial;
        border-color: rgba(127, 127, 127, 0.1);
        overflow-y: hidden;

        margin: 0.25em auto;
    }

    .quote-container {
        text-align: center;
    }
    .bottom {
        display: flex;
    }
    .author {
        display: inline-block;
        padding-left: 1em;
        margin-left: auto;
        text-align: right;
    }
    .author::before {
        content: "—";
    }
    .button {
        color: inherit;
        cursor: pointer;
    }
    .reload-button {
        font-size: 1.15em
    }
    .button:hover {
        color: rgba(0, 0, 0, 0.5);
    }
    :global(.dark) .button:hover {
        color: rgba(255, 255, 255, 0.5);
    }

    :global(.rotate) {
        transform-origin: 50% 50%;
        animation: rotation 1s infinite linear;
    }
    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }
    
    @media (pointer: coarse) {
        .button {
            font-size: 1.75em;
        }
        .reload-button {
            font-size: 2em
        }
    }
</style>
<div class="quote-container">
    <div class="quote-box">
        {#await quote}
            <LoadingText length="50"/>
        {:then quote}
            {quote.quote}
        {/await}
        <div class="bottom">
            {#if withButtons}
                <button class="hidden-button button" use:popup={copyHoverSettings} on:click={copy}>
                    {#if copied}
                        <ClipboardCheck height="1em" width="auto"/>
                    {:else}
                        <Clipboard height="1em" width="auto"/>
                    {/if}
                </button>
                <div class="card p-2 whitespace-nowrap shadow-x1" data-popup="copyHover">
                    {#if copied}
                        Copied to clipboard!
                    {:else}
                        Copy this quote to your clipboard
                    {/if}
                </div>
                &nbsp;
                <button class="hidden-button button reload-button rotate" use:popup={reloadHoverSettings} bind:this={reloadButton} on:click={fetchQuote}>
                    <ArrowClockwise height="1em" width="auto"/>
                </button>
                <div class="card p-2 whitespace-nowrap shadow-x1" data-popup="reloadHover">
                    Get a new quote
                </div>
            {/if}

            <span class="author">
                {#await quote}
                    <LoadingText length="5"/>
                {:then quote}
                    {quote.author}
                {/await}
            </span>
        </div>
    </div>
</div>