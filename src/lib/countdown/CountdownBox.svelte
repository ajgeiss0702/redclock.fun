<script>
    import {calibrateCountdown, periodString, recalcCdd, timeString, stopCountdown} from "$lib/countdown/countdown.js";
    import {onDestroy, onMount} from "svelte";
    import {browser} from "$app/environment";
    import {_GET} from "$lib/utils";

    export let withWeather = true;

    export let box = true;

    if(browser) {
        calibrateCountdown();
    }

    onDestroy(() => {
        stopCountdown();
    })
</script>

<div class:countdown-container={box} class:no-weather={!withWeather}>
    <div class:countdown-inner={box}>
        <div class="countdown-text">
            {#if !browser || !_GET("preview")}
                {#if $timeString === '' || $timeString === 'load'}
                    <img src="/img/loading.svg" alt="loading" height="200" width="200">
                {:else if $timeString === 'bell'}
                    <img src="/img/bell.svg" class="bell" alt="Bell ringing" height="16" width="16">
                {:else}
                    {$timeString}
                {/if}
            {:else}
                Countdown
            {/if}
        </div>
        <br>
        <div class="countdown-period">
            {#if !browser || !_GET("preview")}
                {$periodString}
            {/if}
        </div>
    </div>
</div>


<style>
    div {
        text-align: center;
    }
    .countdown-container {
        width: 65vw;
        min-height: 50vh;
        padding-top: 1em;
        padding-bottom: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
    }
    :global(.layout-default) .countdown-container {
        position: fixed;
        top: 1vh;
        left: 1vw;
    }
    :global(.layout-mirrored) .countdown-container {
        position: fixed;
        top: 1vh;
        right: 1vw;
    }
    :global(.layout-large) .countdown-container {
        position: static !important;
        width: auto !important;
        margin-bottom: 1em;
        padding-bottom: 1em;
        padding-top: 1em;
    }
    :global(.layout-countdown) .countdown-container {
        position: static !important;
        width: auto !important;
        margin-bottom: 1em;
        padding-bottom: 1em;
        padding-top: 1em;
        min-height: 100vh;
    }
    :global(.layout-countdown) .countdown-container {
        font-size: 2em;
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

    :global(.black) .countdown-container {
        background-color: transparent;
        border-color: rgba(255, 255, 255, 0.15);
        border-style: solid;
        border-width: initial;
    }

    .bell {
        animation: bell 1.5s ease-in-out infinite;
    }

    img {
        height: 1em;
        width: 1em;
    }

    .no-weather {
        min-height: 97vh !important;
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
            font-size: 0.8em;
        }
    }
</style>