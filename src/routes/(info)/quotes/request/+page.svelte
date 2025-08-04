<script lang="ts">
    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";
    import {page} from "$app/stores";
    import Turnstile from "$lib/quotes/Turnstile.svelte";
    import {browser, dev} from "$app/environment";
    import {quotes} from "$lib/quotes";
    import {similarity, capitalize} from "$lib/utils"
    import {enhance} from "$app/forms";
    import Quote from "$lib/countdown/sidebar/Quote.svelte";
    import RequestedQuote from "$lib/quotes/RequestedQuote.svelte";
    import {onMount} from "svelte";
    import {bannedPhrases} from "$lib/quoteSettings";
    import {getCookie} from "$lib/cookieUtils";

    export let data;
    export let form;

    let tsPassed = false;

    let quote = "";
    let author = "";

    let quoteSimilarity = 0;
    let originalQuote = -1;

    const hasSchool = browser ? !!getCookie("school") : true;

    $: checkQuote(quote);

    let quoteRequests = browser ? JSON.parse(localStorage.quoteRequests || "[]") || [] : undefined;

    const bannedQuotes = [
        "a7a97477-0467-49e3-b4ea-2f1e7678ac95",
        "57223137-ef36-4a38-8752-ac67d6e5aac5",
        "f33c7926-f4ed-4f56-96f4-2d7437070a90",
        "eb5fc81b-983d-41ae-acdc-d7a23f5d3575",
        "e98525f8-ddfa-4594-b61f-a889fbc6a7cf",
        "36188931-f1be-4af1-a20f-77bd467984be",
        "471516a0-d214-41b0-afad-423c578c15df",
        "8b801f3e-bec7-4477-a9e8-eebd07fbddd7",
        "032710e7-1476-432d-9fd9-4d2a175ea7b6"
    ];

    $: banned = browser ? (() => {
        for (let bannedQuote of bannedQuotes) {
            if(quoteRequests.includes(bannedQuote) || dev) {
                return true;
            }
        }

        for (let bannedPhrase of bannedPhrases) {
            if(quote.trim().toLowerCase().includes(bannedPhrase)) {
                return true;
            }
        }

        return false;
    })() : false;

    const lastSubmitted = browser ? Number(localStorage.lastSubmittedQuote || 0) : 0;
    const nextAllowedSubmittable = data.pendingCount > 100 ? lastSubmitted + (15 * 60 * 60e3) : 0;
    let allowedToSubmit = Date.now() > nextAllowedSubmittable;
    let hoursUntilSubmittable = Math.round((nextAllowedSubmittable - Date.now()) / (60 * 60e3));
    let minutesUntilSubmittable = Math.round((nextAllowedSubmittable - Date.now()) / (60e3));
    onMount(() => {
        let interval = setInterval(() => {
            hoursUntilSubmittable = Math.round((nextAllowedSubmittable - Date.now()) / (60 * 60e3));
            minutesUntilSubmittable = Math.round((nextAllowedSubmittable - Date.now()) / (60e3));
            allowedToSubmit = Date.now() > nextAllowedSubmittable;
        }, 30e3);
        return () => clearInterval(interval);
    })

    function checkQuote(quote: string) {
        let largestSimilarity = 0;
        let largestSimilarityQuote = -1;
        for (const i in quotes) {
            let q = quotes[i].quote;
            let sim = similarity(quote, q);
            if(sim > largestSimilarity) {
                largestSimilarity = sim;
                largestSimilarityQuote = Number(i);
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
<br><br><br>
<span style="font-size: 1.5em">
    There are currently {data.pendingCount} pending quote requests.
</span>
{#if data.pendingCount > 100 || dev}
    <br>
    Due to there being so many pending requests, it might take a while for your quote to be reviewed.
{/if}

<br><br>

If you are submitting a quote that you or someone you know said (not something you can find online)<br>
then make sure to note that in the notes box, stating who that person is to you (your friend, your mom, etc).<br>
Any quote that I cannot find a trace of online (that you dont talk about the person who said it in the note) will be rejected.

<br><br>

{#if data?.isAdmin}
    <a href="request/list" class="btn variant-ghost-primary">List</a>
    <br>
{/if}
<br>


<h1>Quote Request</h1>
<br>

<form class="card inline-block p-4" method="POST" action="?/submit" use:enhance disabled>

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


    <div class="message red">
        <br>
        {#if form?.message}
            {form?.message}
        {/if}
    </div>

    {#if data.pendingCount > 100}
        <br>
        Due to a larger than expected amount of quote requests, you are limited to 1 quote request every 15 hours.
    {/if}
    <div class="message red">
        {#if hoursUntilSubmittable >= 0 && minutesUntilSubmittable >= 0}
            You submitted a quote request recently. You cannot submit another one for
            {#if hoursUntilSubmittable > 1}
                {hoursUntilSubmittable} hours
            {:else if hoursUntilSubmittable === 1}
                {hoursUntilSubmittable} hour
            {:else if hoursUntilSubmittable === 0}
                {#if minutesUntilSubmittable !== 1}
                    {minutesUntilSubmittable} minutes
                {:else}
                    {minutesUntilSubmittable} minute
                {/if}
            {/if}
        {/if}
    </div>

    <Turnstile siteKey="0x4AAAAAAAA-6mZxvGLiTiQC" bind:passed={tsPassed}/>

    <span class="message red">
        {#if !tsPassed && hasSchool}
            Please submit the cloudflare challenge
        {/if}
        {#if !hasSchool}
            You must use this site before submitting a quote request.
        {/if}
    </span>
    <br>
    <button class="btn variant-glass-primary" class:variant-glass-warning={banned} disabled={(!tsPassed || !browser || !quote || !author || banned || !allowedToSubmit || !hasSchool)}>Submit</button>

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
    {#each quoteRequests as id}
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