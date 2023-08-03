<script context="module">
    import {writable} from "svelte/store";

    export const currentTime = writable(new Date());

    export const currentClass = writable("");
</script>
<script>
    import { getNextClass, getTimeString, getDistance } from "$lib/countdown/countdown.ts";
    import {onDestroy, onMount} from "svelte";
    import {browser, building} from "$app/environment";
    import {page} from "$app/stores";
    import {off, onChange} from "$lib/settings";

    export let withWeather = true;

    export let box = true;

    export let school = $page.data.school;
    export let schedule = $page.data.schedule;

    let cachedNextClass = {};

    let countdownText = "load";
    let classText = "";

    onChange("skipAHour", newNextClass);

    async function newNextClass() {
        const newData = await getNextClass(school, schedule);
        cachedNextClass = {
            ...newData,
            school,
            schedule
        }
    }

    async function tick() {
        let countdownDate, className;
        if(!cachedNextClass || !cachedNextClass.school || !cachedNextClass.schedule || cachedNextClass.school !== school || cachedNextClass.schedule !== schedule) {
            const serverNext = $page.data.next;
            const newData = browser || !serverNext ? await getNextClass(school, schedule) : serverNext;
            cachedNextClass = {
                ...newData,
                school,
                schedule
            }
            countdownDate = newData.countdownDate;
            className = "until " + newData.className;
            currentClass.set(newData.className);
        } else {
            countdownDate = cachedNextClass.countdownDate;
            className = "until " + cachedNextClass.className;
        }
        const distance = getDistance(countdownDate)
        const timeString = getTimeString(distance);
        countdownText = timeString;
        classText = className;
        currentTime.set(new Date());
        if(typeof document == 'undefined') return;
        if((
            location.pathname.startsWith("/countdown") ||
            location.pathname.startsWith("/lightweight")
        )) {
            if(timeString !== 'load' && timeString !== '' && timeString !== "bell") {
                document.title = timeString + className + " - Red Clock";
            } else if(timeString === "bell") {
                document.title = "Bell is ringing! - Red Clock";
            } else if(timeString === 'load' || timeString === '') {
                document.title = "Countdown - Red Clock";
            } else {
                document.title = "Red Clock";
            }
        }
    }

    function setCountdownInterval() {
        countdownInterval = setInterval(tick, 1e3);
    }


    let calibratingInterval;
    function calibrateCountdown() {
        if(!browser) return;
        clearInterval(calibratingInterval);
        calibratingInterval = setInterval(() => {
            let ms = new Date().getMilliseconds();
            if(ms <= 50) {
                setCountdownInterval();
                clearInterval(calibratingInterval);
            }
        }, 25);
    }
    let calibrateInterval = browser ? setInterval(calibrateCountdown, 300e3) : false;
    let countdownInterval;

    if(browser) calibrateCountdown();

    onMount(setCountdownInterval)
    if(!building) tick();

    onDestroy(() => {
        clearInterval(countdownInterval);
        clearInterval(calibrateInterval);
        off("skipAHour", newNextClass);
    })
</script>

<div class:countdown-container={box} class:no-weather={!withWeather}>
    <div class:countdown-inner={box}>
        <div class="countdown-text">
            {#if !browser}
                <div class="small-load">
                    <img src="/img/loading.svg" alt="">
                </div>
            {/if}
            {#if !browser || !$page.url.searchParams.has("preview")}
                {#if countdownText === 'bell'}
                    <img src="/img/bell.svg" class="bell" alt="Bell ringing" height="16" width="16">
                {:else}
                    {countdownText}
                {/if}
            {:else}
                Countdown
            {/if}
        </div>
        <br>
        <div class="countdown-period">
            {#if !browser || !$page.url.searchParams.has("preview")}
                {classText}
            {/if}
        </div>
    </div>
</div>


<style>

    .small-load {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        height: 3rem;
        width: 3rem;
    }
    .small-load > img {
        height: 3rem;
        width: 3rem;
    }
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

    @media (max-height: 500px) {
        .countdown-text {
            font-size: 5em;
        }
        .countdown-period {
            font-size: 3em;
        }
    }
</style>