<script>
    import {onMount, onDestroy} from "svelte";
    import './news-styles.css';

    let data = `<img src="/img/loading.svg" style="height: 1em;" alt="loading">`;
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
    div {
        text-align: center;
    }
</style>
<div>
    {@html data}
</div>