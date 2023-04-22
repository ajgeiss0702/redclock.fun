<script>

    import {capitalize} from "../../../../../lib/utils.js";

    export let data;
</script>
<br>
<h1>Quote Request</h1>
Request ID: {data?.id}<br>
<br>

<div class="inline-block mx-auto">
    <table class="table table-hover">
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
    </table>
</div>
<br>
<br>
{#if data?.metadata?.status === "denied"}
    <h2>This quote was denied!</h2>
    Quotes could be denied for any number of reasons.<br>
    From being offensive, a duplicate, or just not a good fit for being displayed on this site.<br>
    <br>
    {#if data?.metadata?.reason}
        The reason given for the denial is: {data?.metadata?.reason}
    {:else}
        Unfortunately, there is not a public deny reason for this quote. <br>
        Usually this happens when the reason for denial is obvious, such as obvious spam or offensive content<br>
        If you believe this is a mistake and/or would like to know why it was denied, feel free to email
        <a href="mailto:support@redclock.fun">support@redclock.fun</a>.<br>
        (make sure to include the Request ID in your email)
    {/if}

{:else if data?.metadata?.status === "accepted"}

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


<style>
    div {
        min-width: min(30em, 90vw);
    }
    td {
        padding-left: 2em;
    }
    .denied {
        color: red
    }
    .accepted {
        color: green;
    }
</style>