<script context="module">
    import './news-styles.css';
    import {writable} from "svelte/store";

    let data = writable(`
<div class="text-center">
    <img src="/img/loading.svg" class="inline-block" style="height: 3em;" alt="loading">
</div>
`);
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
                data.set(response);
            })
            .catch(e => {
                failed = true;
                data.set("Failed to fetch news: " + e);
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

    $: {
        if(localStorage && newsDiv) {
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
    {@html $data}
</div>