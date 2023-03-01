<script>
    import {onMount} from "svelte";
    import {getAPIPrefix} from "$lib/utils.js";
    import LoadingText from "$lib/LoadingText.svelte";
    import {Icon, Popover} from "sveltestrap";

    let quote = new Promise(() => {});

    let copied = false;

    let reloadButton;

    onMount(() => {
        fetchQuote()
    });

    function fetchQuote() {
        reloadButton.classList.add("rotate");
        let fetchingQuote = fetch(getAPIPrefix() + "/api/quotes/get").then(r => r.json());
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
</script>
<style>
    .quote-box {
        display: inline-block;
        padding: 0.5em;
        max-width: 80%;
        border-style: solid;
        border-radius: 1em;
        border-color: rgba(127, 127, 127, 0.1);
        max-height: 27vh;
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
        transform-origin: 50% 43%;
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
</style>
<div class="quote-container">
    <div class="quote-box">
        {#await quote}
            <LoadingText length="50"/>
        {:then quote}
            {quote.quote}
        {/await}
        <div class="bottom">
            <button class="hidden-button button" id="copy-button" on:click={copy}>
                {#if copied}
                    <Icon name="clipboard-check"/>
                {:else}
                    <Icon name="clipboard"/>
                {/if}
            </button>
            &nbsp;
            <button class="hidden-button button reload-button" id="reload-button" bind:this={reloadButton} on:click={fetchQuote}>
                <Icon name="arrow-clockwise"/>
            </button>

            <span class="author">
                {#await quote}
                    <LoadingText length="5"/>
                {:then quote}
                    {quote.author}
                {/await}
            </span>
        </div>
        <Popover
            trigger="hover"
            placement="bottom"
            target="copy-button"
        >
            {#if copied}
                Copied to clipboard!
            {:else}
                Copy this quote to your clipboard
            {/if}
        </Popover>
        <Popover
                trigger="hover"
                placement="bottom"
                target="reload-button"
        >
            Get a new quote
        </Popover>
    </div>
</div>