<script>
    import {capitalize} from "$lib/utils";
    import {invalidateAll} from "$app/navigation";

    export let data;


    function onVisible() {
        invalidateAll();
    }
</script>
<svelte:head>
    <title>List of Quote Requests - Red Clock</title>
</svelte:head>
<svelte:window on:focus={onVisible}/>
<br>

{#if data.hasList}
    <div class="limit mx-auto">
        <h2>Pending</h2>
        <br>
        {#each data.list.filter(r => r.metadata.status === "pending") as request}
            <hr>
            <a class="hidden-link" href="{request.name}">{request.metadata.quotePreview} —{request.metadata.authorPreview}</a>
            <hr>
        {:else}
            No pending requests
        {/each}

        <br>
        <br>
        <h2>Others (accepted/denied)</h2>
        <br>
        {#each data.list.filter(r => r.metadata.status !== "pending") as request}
            <hr>
            <a class="hidden-link" href="{request.name}">
                {request.metadata.quotePreview} —{request.metadata.authorPreview}
                <span
                        class:red={request.metadata.status === "denied"}
                        class:green={request.metadata.status === "accepted"}
                >
                {capitalize(request.metadata.status)}
            </span>
            </a>
            <hr>
        {:else}
            No other requests
        {/each}
        <br>
        {#if !data?.list_complete}
            ... and more
        {/if}
    </div>

{:else}
    <a class="btn variant-glass-primary" href="/editor/auth/signin?to=/quotes/request/list">Sign In</a>
{/if}
<style>
    .red {
        color: red
    }
    .green {
        color: green
    }

    .limit {
        width: calc(min(90vw, 56em))
    }
</style>