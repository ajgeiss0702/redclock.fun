<script>
    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";
    import {page} from "$app/stores";
    import Turnstile from "$lib/quotes/Turnstile.svelte";
    import {browser, dev} from "$app/environment";
    import {quotes} from "$lib/quotes";
    import {similarity, capitalize} from "$lib/utils"
    import {enhance} from "$app/forms";
    import Quote from "$lib/countdown/sidebar/Quote.svelte";
    import RequestedQuote from "$lib/quotes/RequestedQuote.svelte";

    export let data;
    export let form;

    let tsPassed = false;

    let quote = "";
    let author = "";

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
<svelte:head>
    <title>Quote Request - Red Clock</title>
    <meta name="description" content="Suggest a quote to be added to Red Clock"/>
</svelte:head>
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
To increase the chances that any joke quotes will be accepted, I would recommend submitting at least 2 other, non-joke, quotes.<br>
The more joke quotes there are, the less special they become when you get them.
<br><br>
I would strongly recommend filling out the "note" box with any info on why you think your quote should be accepted.

<br><br>

{#if data?.isAdmin}
    <a href="request/list" class="btn variant-ghost-primary">List</a>
    <br>
{/if}
<br>


<h1>Quote Request</h1>
<br>

<form class="card inline-block p-4" method="POST" action="?/submit" use:enhance>

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
<br>
<br>
<h2>Quote Preview</h2>
If your quote is accepted, here is what it might look like:
<div class="quote-container">
    <Quote initialQuote={{quote, author}} shouldFetch={false} withButtons={false}/>
</div>
<br>
<h2>Your previous requests</h2>
<br>
{#if browser}
    {#each JSON.parse(localStorage.quoteRequests || "[]") || [] as id}
        <RequestedQuote {id}/>
    {:else}
        <span class="opacity-50">You haven't requested any quotes yet!</span>
    {/each}
{:else}
    <span class="opacity-50">Loading..</span>
{/if}
<br>


<div class="bottom"></div>
<style>
    .quote-container {
        min-height: 6em;
    }
    .message {
        min-height: 1.5em;
    }
    .red {
        color: red
    }
    .green {
        color: green
    }

    input[name=quote], .limit {
        width: calc(min(90vw, 56em))
    }

    .bottom {
        margin-bottom: 20em;
    }
</style>