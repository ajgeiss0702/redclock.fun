<script>
    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";
    import {page} from "$app/stores";

    export let data;
    console.log({data});
</script>
<br>
<div class="text-left mx-4">
    <a href={$page.url.hostname === "ul.redclock.fun" ? "https://redclock.fun/quotes" : "/quotes"} class="hover-underline">
        <CaretLeftFill class="inline-block"/>
        Back to quotes
    </a>
</div>

Quote Request coming soon

{#if data.admin}
    Hello, aj
    <h1>All requests</h1>
    {#each data.list as file}
        {file}<br>
    {/each}
{/if}