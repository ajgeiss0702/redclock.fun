<script>
    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";
    import {page} from "$app/stores";
    import Turnstile from "$lib/quotes/Turnstile.svelte";
    import {browser, dev} from "$app/environment";

    export let data;
    console.log({data});

    let tsPassed = false;
</script>
<br>
<div class="text-left mx-4">
    <a href={$page.url.hostname === "ul.redclock.fun" ? "https://redclock.fun/quotes" : "/quotes"} class="hover-underline">
        <CaretLeftFill class="inline-block"/>
        Back to quotes
    </a>
</div>

<h1>Quote Request</h1>
<br>

{#if dev}
    <form class="card inline-block p-4" method="POST" action="?/submit">

        <label class="label">
            <span>Quote</span>
            <br>
            <input class="input px-3" name="quote" type="text" placeholder="The hardest choices require the strongest wills"/>
        </label>
        <br>
        <label class="label">
            <span>Author</span>
            <input class="input px-3" name="author" type="text" placeholder="Thanos"/>
        </label>

        <br>


        <Turnstile siteKey="0x4AAAAAAAA-6mZxvGLiTiQC" bind:passed={tsPassed}/>

        <span class="ts-submit-required">
        {#if !tsPassed}
            Please submit the cloudflare challenge
        {/if}
    </span>
        <br>
        <button class="btn variant-glass-primary" disabled={(!tsPassed || !browser)}>Submit</button>
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
    .ts-submit-required {
        height: 1em;
        color: red;
    }

    input[name=quote] {
        width: calc(min(90vw, 50em))
    }
</style>