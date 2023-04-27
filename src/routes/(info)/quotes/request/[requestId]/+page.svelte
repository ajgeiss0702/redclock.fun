<script>

    import {capitalize} from "$lib/utils.js";
    import {enhance} from "$app/forms";
    import {quotes} from "$lib/quotes.js";
    import {invalidateAll} from "$app/navigation";

    export let data;
    export let form;

    let foundQuote;
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

    $: console.log({reason})

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
    <h2>Please bookmark this page!</h2>
    <br>
    If you want to check the status of your quote suggestion, make sure to bookmark this page.<br>
    If you do not, it may be lost. There will not be another link to this page on the site.<br>
    <br>
    It will be reviewed at some point in the future. Make sure to check back here to see if the quote has been accepted!<br>
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