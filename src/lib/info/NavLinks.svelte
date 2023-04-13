<span class:vertical={vertical}>
    {#if browser && localStorage.school}
        <a href="/countdown">Go to Countdown</a>
    {:else}
        <a href="/schools">Select a School</a>
    {/if}
    <a href="/about">About Red Clock</a>
    <a href="/desktop">Desktop App</a>
    <a href="/discord">Discord</a>

    {#if browser && $page.url.pathname.startsWith("/stats")}
        &nbsp;
        &nbsp;
        <a href="/stats">Stats</a>
        <a href="/stats/daygraph">Past 30 days</a>
    {/if}
</span>


<style>
    a {
        padding-left: 1em;

        color: inherit !important;
    }

    .vertical > a {
        display: block;
        font-size: 1.5em;
    }
</style>
<script>
    import {page} from "$app/stores";
    import {browser} from "$app/environment";

    export let vertical = false;
</script>