<script context="module">
    import './news-styles.css';

    let data = `<img src="/img/loading.svg" style="height: 1em;" alt="loading">`;
    let failed = false;

    let lastFetch = 0;

    function refreshNews() {
        if(Date.now() - lastFetch < 300e3) return; // throttle news updating
        lastFetch = Date.now();
        fetch("https://ajg0702.us/api/rmf/news.html")
            .then(response => response.text())
            .then(response => {
                response = response.replace('<script', '&ltscript');
                response = response.replace('</script', '&lt/script');

                response = response.replace('<link', '&ltlink');
                response = response.replace('</link', '&lt/link');
                data = response;
            })
            .catch(e => {
                failed = true;
                data = "Failed to fetch news: " + e;
            })
    }
    refreshNews()

    let newsDiv;

</script>
<script>
    import {onDestroy, onMount} from "svelte";

    export let unreadCount = 0;
    export let newsLength = 0;

    export let currentTab;

    let thingLastFetch;

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


    // TODO: fix unread news thing
    $: {
        if(localStorage && newsDiv) {
            // this is to make this reactive block run when lastFetch is updated (when the news is fetched)
            thingLastFetch = lastFetch;
            setTimeout(() => {
                newsLength = newsDiv.getElementsByTagName("div").length;
                if(currentTab === "news") {
                    localStorage.setItem("lastReadNews", newsLength)
                    unreadCount = 0;
                } else {
                    let readNews = localStorage.getItem("lastReadNews") || 0;
                    unreadCount = newsLength - readNews;
                }

            }, 500)
        }
    }
</script>
<style>
    div {
        text-align: center;
    }
</style>
<br>
<div bind:this={newsDiv}>
    {@html data}
</div>