<script>
    import {onMount, onDestroy} from "svelte";
    import './news-styles.css';

    let data = `<img src="/img/loading.svg" style="height: 1em;" alt="loading">`;
    let failed = false;

    export let unreadCount = 0;
    export let newsLength = 0;

    export let currentTab;

    function refreshNews() {
        fetch("https://ajg0702.us/api/rmf/news.html")
            .then(response => response.text())
            .then(response => {
                response = response.replace('<script', '&ltscript');
                response = response.replace('</script', '&lt/script');

                response = response.replace('<link', '&ltlink');
                response = response.replace('</link', '&lt/link');
                data = response;

                if(localStorage && newsDiv) {
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

    let newsDiv;

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
    {@html data}
</div>