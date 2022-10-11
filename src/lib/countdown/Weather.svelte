<script>
    import {create, get, onChange} from "$lib/settings.ts";
    import {onMount} from "svelte";
    import {getSchoolCode} from "$lib/utils.js";

    export let shown = true;
    export let enabled = true;

    onMount(() => {
        calcShown()

    })

    function calcShown() {
        shown = getSchoolCode() === "rmhs" && !get("hideWeather");
    }

    create('enableWeather', true, 'Enable Weather', 'Disabling this will save battery (disable the animated weather icon, that\'s the thing that sucks the most battery)');
    create('animatedWeatherIcon', false, "Animated weather icon 🔋", "The animated weather icon looks cool, but it sucks the most power of everything on the page. Disabling it will help save battery")
    create('exactTemp', false, "Exact temperature", "If enabled, will round to two decimal places on the temperature. If disabled, will round to the nearest whole number.")
    create("hideWeather", false, "Hide Weather", "Should the weather be hidden completely (like its not there)");

    onChange("hideWeather", calcShown);
    onChange("enableWeather", update);
    onChange("exactTemp", update);

    function update() {
        enabled = get("enableWeather");
    }
</script>
<style>
    :global(.default) .weather-container {
        width: 65vw;
        min-height: 45vh;
        padding-top: 1em;
        padding-bottom: 1em;
        position: fixed;
        top: 53vh;
        left: 1vw;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
    }
    .weather-container {
        background-color: rgba(242, 242, 242, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    .no-weather {
        display: none !important;
    }

    :global(.dark) .weather-container {
        background-color: rgba(52, 52, 52, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    @media(orientation: portrait) {
        .weather-container {
            position: static !important;
            width: auto !important;
            margin-bottom: 1em;
        }
    }
</style>
<div class="weather-container" class:no-weather={!shown}>
    {#if enabled}
        Weather is cool (but actually hot because its arizona)
    {:else}
        No weather
    {/if}

</div>