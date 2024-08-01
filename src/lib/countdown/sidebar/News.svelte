<script context="module">
    import './news-styles.css';
    import {derived, get, readable, readonly, writable} from "svelte/store";
    import {browser} from "$app/environment";

    let data = writable(`
<div class="text-center">
    <img src="/img/loading.svg" class="inline-block" style="height: 3em;" alt="loading">
</div>
`);

    let setUnreadNews;

    const newsCountWrite = writable(0);
    export const newsCount = readonly(newsCountWrite);
    export const unreadNewsCount = derived(newsCount, (newsCount, set) => {
        setUnreadNews = set
        if(browser) set(newsCount - (Number(localStorage.lastReadNews) || 0));
    }, 0);


    let failed = false;

    let lastFetch = 0;

    function refreshNews() {
        if(Date.now() - lastFetch < 300e3) return; // throttle news updating
        lastFetch = Date.now();
        fetch("https://temp-schedules.redclock.fun/news.html")
            .then(response => response.text())
            .then(response => {
                response = response.replace('<script', '&ltscript');
                response = response.replace('</script', '&lt/script');

                response = response.replace('<link', '&ltlink');
                response = response.replace('</link', '&lt/link');

                data.set(response);

                const newsCount = (response.match(/<div/g) || []).length;
                newsCountWrite.set(newsCount);
            })
            .catch(e => {
                failed = true;
                data.set("Failed to fetch news: " + e);
            })
    }

    refreshNews();

    export function readNews() {
        console.debug("reading news")
        let nCount = get(newsCountWrite)
        if(nCount === 0) return
        localStorage.lastReadNews = nCount;
        setUnreadNews(0);
    }

    let newsDiv;

</script>
<script>
    import {onDestroy, onMount} from "svelte";

    export let currentTab;

    let thingLastFetch;

    $: if(currentTab === "news") readNews();

    data.subscribe(() => {
        setTimeout(() => {
            if(currentTab === "news") readNews();
        }, 1)
    })

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
    div {
        text-align: center;
    }
</style>
<br>
<div bind:this={newsDiv}>
    {@html $data}
</div>