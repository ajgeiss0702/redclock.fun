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
        @apply px-2;
    }
    img {
        height: 90vw;
        max-height: 70vh;
        @apply mx-auto;
    }
</style>

<div class="outer">
    <div class="inner">
        <img src="/img/broken-clock.webp" alt="Broken Clock"><br>
        <br>
        <h1>{$page.status}</h1>
        {$page.error.message}
        {#if $page.status !== 404}
            <br>
            <br>
            Try reloading.<br>
            If the issue keeps happening, please email <a href="mailto:support@redclock.fun">support@redclock.fun</a> with what page this is on, and what you did right before this page appeared
        {/if}
    </div>
</div>