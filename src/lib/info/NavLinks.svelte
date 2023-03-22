<span class:vertical={vertical}>
    {#if browser && localStorage.school}
        <a href="/countdown">Go to Countdown</a>
    {:else}
        <a href="/schools">Select a School</a>
    {/if}
    <a href="/about">About Red Clock</a>
    <a href="/desktop">Desktop App</a>
    <a href="/discord">Discord</a>
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
    export let vertical;

    import {browser} from "$app/environment";
</script>