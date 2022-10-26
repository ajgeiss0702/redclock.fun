<script>
    import {calibrateCountdown, periodString, timeString} from "$lib/countdown/countdown.js";
    import {onMount} from "svelte";

    onMount(() => {
        calibrateCountdown();
    })
</script>
<style>
    div {
        text-align: center;
    }
    .countdown-text, .countdown-period {
        display: inline-block;
        vertical-align: middle;
        line-height: 0.8em;
    }
    .countdown-text {
        font-size: 10em;
    }
    .countdown-period {
        font-size: 4em;
    }
    .banner {
        font-size: 10vh;
        display: inline-block;
        width: 99vw;
        text-align: center;
        line-height: 1em;
        padding-top: 0;
        margin: 0 0 2rem;
        font-weight: bold;
    }

    :global(body, html) {
        background-color: rgb(140, 0, 0) !important;
    }
</style>
<div>
    <span class="banner">www.redclock.fun</span>
    <br>
    <div class="countdown-text">
        {#if $timeString === '' || $timeString === 'load'}
            <img src="/img/loading.svg" alt="loading" style="height: 1em;">
        {:else if $timeString === 'bell'}
            <img src="/img/bell.svg" style="height: 1em;" class="bell-animation" alt="Bell ringing">
        {:else}
            {$timeString}
        {/if}
    </div>
    <br>
    <div class="countdown-period">
        {$periodString}
    </div>
</div>