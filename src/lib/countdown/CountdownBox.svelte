<script>
    import {calibrateCountdown, periodString, timeString} from "$lib/countdown/countdown.js";
    import {onMount} from "svelte";

    onMount(() => {
        calibrateCountdown();
    })
</script>

<style>
    :global(.default) .countdown-container {
        width: 65vw;
        min-height: 50vh;
        position: fixed;
        top: 1vh;
        left: 1vw;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 1em;
        padding-right: 1em;
        border-radius: 8px;
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

    .countdown-container {
        background-color: rgba(242, 242, 242, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    :global(.dark) .countdown-container {
        background-color: rgba(52, 52, 52, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    .bell-animation {
        animation: bell 1.5s ease-in-out infinite;
    }

    @keyframes bell {
        0% {
            transform-origin: top center;
            transform: rotate(30deg);
        }
        50% {
            transform-origin: top center;
            transform: rotate(-30deg);
        }
        100% {
            transform-origin: top center;
            transform: rotate(30deg);
        }
    }

    @media(orientation: portrait) {
        .countdown-container {
            position: static !important;
            width: auto !important;
            margin-bottom: 1em;
            padding-bottom: 1em;
            padding-top: 1em;
        }
    }
</style>
<div class="countdown-container">
    <div class="countdown-inner">
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
        <div class="countdown-period">{$periodString}</div>
    </div>
</div>