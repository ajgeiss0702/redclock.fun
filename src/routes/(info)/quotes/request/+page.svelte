<script>
    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";
    import {page} from "$app/stores";
    import Turnstile from "$lib/quotes/Turnstile.svelte";
    import {browser, dev} from "$app/environment";
    import {quotes} from "$lib/quotes";
    import {similarity} from "$lib/utils"

    export let data;
    export let form;
    console.log({data});

    let tsPassed = false;

    let quote;
    let author;

    let quoteSimilarity = 0;
    let originalQuote = -1;

    $: checkQuote(quote);

    function checkQuote(quote) {
        let largestSimilarity = 0;
        let largestSimilarityQuote = -1;
        for (const i in quotes) {
            let q = quotes[i].quote;
            let sim = similarity(quote, q);
            if(sim > largestSimilarity) {
                largestSimilarity = sim;
                largestSimilarityQuote = i;
            }
        }
        quoteSimilarity = largestSimilarity;
        originalQuote = largestSimilarityQuote;
    }
</script>
<br>
<div class="text-left mx-4">
    <a href={$page.url.hostname === "ul.redclock.fun" ? "https://redclock.fun/quotes" : "/quotes"} class="hover-underline">
        <CaretLeftFill class="inline-block"/>
        Back to quotes
    </a>
</div>

<h1>Quote Guidelines</h1>
<br>

Generally, I would like quotes to be inspirational, and mostly lighthearted.
<br><br>
Remember to check the quote list on the previous page for your quote. Duplicate quotes will be rejected.
<br><br>
If you plan on submitting a joke quote, note that I will very rarely accept joke quotes.<br>
The more joke quotes there are, the less special they become when you get them
<br><br>
I would strongly recommend filling out the "note" box with any info on why you think your quote should be accepted.

<br><br><br>


<h1>Quote Request</h1>
<br>

{#if dev || data?.hasList}
    <form class="card inline-block p-4" method="POST" action="?/submit">

        <label class="label">
            <span>Quote</span>
            <br>
            <input class="input px-3" name="quote" type="text" bind:value={quote} placeholder="The hardest choices require the strongest wills"/>
        </label>
        <br>
        <label class="label">
            <span>Author</span>
            <input class="input px-3" name="author" type="text" bind:value={author} placeholder="Thanos"/>
        </label>
        <br>
        <label class="label">
            <span>Notes</span>
            <input class="input px-3" name="note" type="text" placeholder="I like this quote because..."/>
            The note will not be with the final quote. It is only used during the approval process.
        </label>


        <span class="message red">
            {#if form?.message}
                {form?.message}
            {/if}
        </span>

        <Turnstile siteKey="0x4AAAAAAAA-6mZxvGLiTiQC" bind:passed={tsPassed}/>

        <span class="message red">
            {#if !tsPassed}
                Please submit the cloudflare challenge
            {/if}
        </span>
        <br>
        <button class="btn variant-glass-primary" disabled={(!tsPassed || !browser || !quote || !author)}>Submit</button>

        <div class="message">
            {#if quoteSimilarity > 0.6}
                Your quote is very similar to
                <a href="/quotes/{originalQuote}" target="_blank">quote #{originalQuote}</a>.
                Duplicate quotes will be rejected.
            {/if}
        </div>
    </form>
{:else}
    Quote request coming soon!
{/if}
<br>
<br>
<br>

{#if data.admin}
    <h2>All requests</h2>
    <br>
    {#each data.list as file}
        {file}<br>
    {:else}
        No requests
    {/each}
{/if}

<style>
    .message {
        min-height: 1.5em;
    }
    .red {
        color: red
    }

    input[name=quote] {
        width: calc(min(90vw, 56em))
    }
</style>