<script lang="ts">

    import {capitalize} from "$lib/utils";
    import {enhance} from "$app/forms";
    import {quotes} from "$lib/quotes";
    import {invalidateAll} from "$app/navigation";
    import Quote from "../../../../../lib/countdown/sidebar/Quote.svelte";
    import {page} from "$app/stores";
    import {browser} from "$app/environment";

    export let data;
    export let form;

    if(browser && $page.url.searchParams.get("s") === "") {
        const existing = (JSON.parse(localStorage.quoteRequests || "[]") || []);
        existing.push(data?.id);
        localStorage.setItem("quoteRequests", JSON.stringify(existing));
        localStorage.setItem("lastSubmittedQuote", Date.now()+"");
        window.history.replaceState({}, document.title, $page.url.pathname);
    }

    let fixedQuote: string = "";
    $: {
        fixedQuote = data.value?.quote;
        if(fixedQuote.length > 1) {
            // if first character is a double quote
            if(["\"", "“"].includes(fixedQuote.substring(0, 1))) {
                fixedQuote = fixedQuote.substring(1);
            }
            // if last character is a double quote
            if(["\"", "”"].includes(fixedQuote.substring(fixedQuote.length - 1))) {
                fixedQuote = fixedQuote.substring(0, fixedQuote.length - 1);
            }
        }
    }

    let foundQuote: Quote;
    $: if(data?.metadata?.status === "accepted") {
        for (const i in quotes) {
            const quote = quotes[i];
            if(quote.request !== data?.id) continue;
            foundQuote = {
                id: i,
                ...quote
            };
            break;
        }
    }

    let defaultAction;

    $: if(data?.metadata?.status === "pending") {
        defaultAction = "?/pend";
    } else if(data?.metadata?.status === "accepted") {
        defaultAction = "?/accept";
    } else if(data?.metadata?.status === "denied") {
        defaultAction = "?/deny"
    }

    let originalReason = data?.metadata?.reason ?? "";
    let reason = data?.metadata?.reason ?? "";

    function onVisible() {
        if(!data?.metadata?.status || data.metadata.status === "pending") {
            invalidateAll();
        }
    }
</script>
<svelte:window on:focus={onVisible}/>

<svelte:head>
    <title>Quote Request - Red Clock</title>
    <meta name="description" content="{data?.value?.quote} —{data?.value?.author} (Request ID: {data?.id} | Status: {capitalize(data?.metadata?.status)})"/>
</svelte:head>


<br>
<h1>Quote Request</h1>
Request ID: {data?.id}<br>
<br>

<div class="inline-block mx-auto">
    <table class="table table-hover">
        <tbody>
            <tr>
                <td class="text-right">Quote</td>
                <td class="text-left">{data?.value?.quote}</td>
            </tr>
            <tr>
                <td class="text-right">Author</td>
                <td class="text-left">{data?.value?.author}</td>
            </tr>
            <tr><td>&nbsp;</td></tr>
            <tr>
                <td class="text-right">Note</td>
                <td class="text-left">{data?.value?.note}</td>
            </tr>
            <tr>
                <td class="text-right">Status</td>
                <td class="text-left">
                    <span
                            class:accepted={data?.metadata?.status === "accepted"}
                            class:denied={data?.metadata?.status === "denied"}
                    >
                        {capitalize(data?.metadata?.status)}
                    </span>
                </td>
            </tr>
            {#if data?.value?.similarQuotes ?? false}
                <tr>
                    <td class="text-right">Similar Quotes</td>
                    <td class="text-left">
                        {#each data?.value?.similarQuotes?.filter(q => q.similarity > 0.40) as similar}
                            <a href="/quotes/{similar.quote.quoteNumber}" target="_blank">
                                #{similar.quote.quoteNumber}
                            </a>
                            &nbsp;
                        {:else}
                            No detected similar quotes
                        {/each}
                    </td>
                </tr>
            {/if}
            <tr>
                <td class="text-right">Date Submitted</td>
                <td class="text-left">{new Date(data?.metadata?.submitted).toLocaleString()}</td>
            </tr>
        </tbody>
    </table>
</div>
<br>
<br>
{#if data?.canManage}
    <div class="card inline-block mx-auto p-4">
        <form method="POST" action={defaultAction} use:enhance={() => {
            return async ({ update }) => {
                await update({ reset: false });
                originalReason = reason;
            };
          }}
        >
            <button class="hidden"></button>
            <button formaction="?/accept" class="btn btn-sm variant-ghost-success" disabled={data?.metadata?.status === "accepted" && reason === originalReason}>
                Accept
            </button>
            <button formaction="?/pend" class="btn btn-sm variant-ghost-surface" disabled={data?.metadata?.status === "pending" && reason === originalReason}>
                Pend
            </button>
            <button formaction="?/deny" class="btn btn-sm variant-ghost-error" disabled={data?.metadata?.status === "denied" && reason === originalReason}>
                Deny
            </button>

            <input class="input px-3 mt-2" name="reason" type="text" placeholder="Reason" bind:value={reason}/>

            {#if form?.message}
                {form?.message}
            {/if}
        </form>
        {#if data?.metadata.status === "accepted"}
            <br>
            <pre class="text-left">&#123;
    quote: {JSON.stringify(fixedQuote)},
    author: {JSON.stringify(data?.value?.author)},
    request: {JSON.stringify(data?.id)}
&#125;</pre>
        {/if}
        <br>
        <h3>Similar Quote Requests</h3>
        {#each data.similarQuoteRequests.filter(q => q.similarity > 0.6) as request}
            <hr>
            <a class="hidden-link" href="{request.id}">
                {request.quote} —{request.author}
                <span
                        class:red={request.status === "denied"}
                        class:opacity-75={request.status === "pending"}
                        class:green={request.status === "accepted"}
                >
                    {capitalize(request.status)}
                </span>
                <span class="opacity-75">
                    {Math.round(request.similarity * 10000)/100}%
                </span>
            </a>
            <hr>
        {:else}
            No similar requests!
        {/each}
    </div>
{/if}
<br>
<br>
{#if data?.metadata?.status === "denied"}
    <h2>This quote was denied!</h2>
    Quotes could be denied for any number of reasons.<br>
    From being offensive, a duplicate, or just not a good fit for being displayed on this site.<br>
    <br>
    {#if data?.metadata?.reason}
        The reason given for the denial is: <br>
        <div class="inline-block card mx-auto">
            {data?.metadata?.reason}
        </div>
    {:else}
        Unfortunately, there is not a public deny reason for this quote. <br>
        Usually this happens when the reason for denial is obvious, such as obvious spam or offensive content<br>
        If you believe this is a mistake and/or would like to know why it was denied, feel free to email
        <a href="mailto:support@redclock.fun">support@redclock.fun</a>.<br>
        (make sure to include the Request ID in your email)
    {/if}
    <br>
    <br>
    {#if data?.metadata?.expiration}
        <h2>Removal</h2>
        To save on storage costs, denied quote suggestions are automatically deleted after 90 days.<br>
        If you want to save this quote, make sure you have already done so.<br>
        <br>
        This quote will be deleted in {Math.round(((data?.metadata?.expiration * 1000) - Date.now()) / (1000 * 60 * 60 * 24))} days.
    {/if}
{:else if data?.metadata?.status === "accepted"}
    {#if foundQuote}
        <h2>Quote accepted!</h2>
        This quote has been accepted and is now <a href="/quotes/{foundQuote.id}">quote #{foundQuote.id}</a>
    {:else}
        <h2>Congrats!</h2>
        This quote has been accepted, and will shortly be a part of Red Clock!<br>
        Thank you for taking your time to suggest a quote.
    {/if}
    <br>
    <br>
    {#if data?.metadata?.reason}
        <h2>Note</h2>
        This quote was accepted with a note:<br>
        <div class="inline-block card mx-auto">
            {data?.metadata?.reason}
        </div>
    {/if}
{:else}
    <h2>Please be patient while your quote is pending review</h2>
    <br>
    It will be reviewed at some point in the future. Make sure to check back here to see if the quote has been accepted!<br>
    <br>
    <br>
    <h3>Preview</h3>
    If your quote is accepted, here is what it might look like:
    <Quote initialQuote={{...data?.value, quote: fixedQuote}} shouldFetch={false} withButtons={false}/>
    <br>
    <br>
    {#if Date.now() - data?.metadata?.submitted > (1000 * 60 * 60 * 24 * 5)}
        <!-- show message to contact support if it is still pending after 5 days-->
        <h3>It looks like this quote has been pending for a long time.</h3>
        <br>
        Feel free to contact support to be sure it wasn't forgotten about:
        <a href="mailto:support@redclock.fun">support@redclock.fun</a><br>
        (make sure to include the Request ID in your email)
    {/if}
{/if}
<br>
<br>
<br>


<style>
    div {
        min-width: min(30em, 90vw);
        max-width: 95vw;
    }
    td {
        padding-left: 2em;
        word-wrap: break-word;
        white-space: normal !important;
    }
    .denied {
        color: red
    }
    .accepted {
        color: green;
    }
</style>