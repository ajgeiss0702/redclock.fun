<script>
    import { page } from '$app/stores';
</script>
<style>
    div.outer {
        display: flex;
        height: 100vh;
        align-items: center;
        justify-content: center;
    }
    div.inner {
        text-align: center;
    }
    img {
        height: 90vw;
        max-height: 70vh;
    }
</style>

<div class="outer">
    <div class="inner">
        <img src="/img/broken-clock.webp" alt="Broken Clock"><br>
        <br>
        <h1>{$page.status}</h1>
        {$page.error.message}
    </div>
</div>