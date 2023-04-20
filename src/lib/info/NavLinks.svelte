<span class:vertical={vertical}>
    {#if $page.data?.school || (browser && localStorage.school)}
        <a href={ulRedirect("/countdown")}>Go to Countdown</a>
    {:else}
        <a href={ulRedirect("/schools")}>Select a School</a>
    {/if}
    <a href={ulRedirect("/about")}>About Red Clock</a>
    <a href={ulRedirect("/desktop")}>Desktop App</a>
    <a href={ulRedirect("/quotes")}>Quotes</a>
    <a href={ulRedirect("/discord")}>Discord</a>

    {#if browser && $page.url.pathname.startsWith("/stats")}
        &nbsp;
        &nbsp;
        <a href={ulRedirect("/stats")}>Stats</a>
        <a href={ulRedirect("/stats/daygraph")}>Past 30 days</a>
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

    function ulRedirect(url) {
        if($page.url.hostname === "ul.redclock.fun") {
            return "https://redclock.fun" + url;
        }
        return url;
    }
</script>