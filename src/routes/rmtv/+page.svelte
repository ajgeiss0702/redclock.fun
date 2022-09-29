<script>
    import {calibrateCountdown, periodString, timeString} from "$lib/countdown/countdown.js";
    import {onMount} from "svelte";

    onMount(() => {
        calibrateCountdown();
    })
</script>
<style>
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
</style>
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