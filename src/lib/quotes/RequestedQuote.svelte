<script lang="ts">
    import {page} from "$app/stores";
    import {capitalize} from "$lib/utils"
    import LoadingText from "$lib/LoadingText.svelte";

    export let id;

    $: request = fetch($page.url.origin + "/api/quotes/request/" + id)
        .then(async (request) => {
            return {request, quote: await request.json()}
        });

</script>
{#await request}
    <hr>
    <a class="hidden-link" href="request/{id}">
        <LoadingText length="50"/>
        —<LoadingText length="10"/>
    </a>
    <hr>
{:then {request, quote}}
    {#if request.status === 200}
        <hr>
        <a class="hidden-link" href="request/{id}">
            {quote.metadata.quotePreview} —{quote.metadata.authorPreview}
            <span
                    class:red={quote.metadata.status === "denied"}
                    class:green={quote.metadata.status === "accepted"}
                    class:gray={quote.metadata.status === "pending"}
            >
                {capitalize(quote.metadata.status)}
            </span>
        </a>
        <hr>
    {/if}
{/await}

<style>

    .red {
        color: red
    }
    .green {
        color: green
    }
    .gray {
        opacity: 60%;
    }
</style>