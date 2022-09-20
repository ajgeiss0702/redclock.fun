<script>
    import {onMount, onDestroy} from "svelte";

    let data;
    let failed = false;

    function refreshNews() {
        fetch("https://ajg0702.us/api/rmf/news.html")
            .then(response => response.text())
            .then(response => {
                response = response.replace('<script', '&ltscript');
                response = response.replace('</script', '&lt/script');

                response = response.replace('<link', '&ltlink');
                response = response.replace('</link', '&lt/link');
                data = response
            })
            .catch(e => {
                failed = true;
                data = "Failed to fetch news: " + e;
            })
    }
    refreshNews()

    let updateInterval;
    onDestroy(() => {
        clearInterval(updateInterval);
    })

    onMount(() => {
        updateInterval = setInterval(refreshNews, 300e3);
        if(failed) {
            refreshNews();
        }
    })
</script>
<style>
    :global(.hidden) {
        display: none;
    }
    :global(.newsbox) {
        display: inline-block;
        margin-left: 1em;
        margin-right: 1em;
        margin-bottom: 1.5em;
        padding-left: 1em;
        padding-right: 1em;
        border-radius: 10px;
        border-width: 1px;
        border-style: solid;
    }


    :global(.newsbox) {
        background-color: rgba(242, 242, 242, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
        border: none;
    }

    :global(.dark .newsbox) {
        background-color: rgba(52, 52, 52, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }
</style>
{@html data}