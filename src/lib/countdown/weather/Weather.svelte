<script>
    import {create, get, onChange} from "$lib/settings.ts";
    import {onDestroy, onMount} from "svelte";
    import {getSchoolCode, daysOfWeek, capitalize, getAPIPrefix} from "$lib/utils";
    import LoadingText from "$lib/LoadingText.svelte";
    import WeatherIcon from "$lib/countdown/weather/WeatherIcon.svelte";
    import ExclamationTriangle from "svelte-bootstrap-icons/lib/ExclamationTriangle.svelte";
    import {browser} from "$app/environment";
    import {_GET} from "$lib/utils";
    import {page} from "$app/stores";

    export let shown = true;
    export let enabled = true;

    const orderedDays = [
        "Today",
        "Tomorrow"
    ];

    const day = new Date().getDay();
    for (let i = day+2; i !== day; i++) {
        if(i >= 7) {
            i = -1;
            continue;
        }

        orderedDays.push(daysOfWeek[i]);
    }

    let updateInterval;

    let promiseHasData = false;
    let weatherData = new Promise(() => {});

    onMount(() => {
        // the update task runs every 5 minutes, but a limiter inside the function only lets it run (at most) every 29 minutes
        updateInterval = setInterval(update, 5 * 60 * 1000);

        update();
    });
    onDestroy(() => {
        clearInterval(updateInterval)
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

    let retryLength = 5;
    let retryTimeout;

    /** @type boolean | undefined */
    let lastExactTemp;

    let lastUpdate = 0;

    function update() {
        calcShown();
        enabled = get("enableWeather") && shown && !_GET("preview");

        if(!enabled) return;

        const currentExactTemp = get("exactTemp");
        if(currentExactTemp !== lastExactTemp) lastExactTemp = currentExactTemp;

        if(lastUpdate !== 0 && browser) {
            const distance = Date.now() - lastUpdate
            if(!document.hasFocus()) {
                // in the background, limit weather updates to every 3 hours
                if(distance < 3 * 60 * 60e3) return;
            } else {
                if(distance < 29 * 60e3) return;
            }
        }

        lastUpdate = Date.now();
        fetch(getAPIPrefix() + "/api/weather/get/" + getSchoolCode())
            .then(r => r.json())
            .then(d => {
                if(!d.weatherData) throw new Error("got response, but not weather data!");
                weatherData = Promise.resolve(d);
                promiseHasData = true;
                retryLength = 5;
            })
            .catch(e => {
                if(!promiseHasData) weatherData = Promise.reject(e);
                console.warn("Failed to fetch weather: " + e + ". Retrying in " + retryLength + " seconds");
                clearTimeout(retryTimeout);
                retryTimeout = setTimeout(update, retryLength * 1000);
                if(retryLength < 30) {
                    retryLength += 5;
                }
            })
    }

    let weekly = false;
    if(browser) {
        weekly = localStorage.getItem("weather-weekly") === "true";
    }
    function toggleWeekly() {
        weekly = !weekly;
        localStorage.setItem("weather-weekly", String(weekly));
    }
</script>
<svelte:window on:focus={update}/>
<div class="weather-container" class:no-weather={!shown}>
    {#if enabled}
        <table>
            <tr>
                <td>
                    <div class="weather-icon">
                        {#await weatherData}
                            <LoadingText circle/>
                        {:then data}
                            <WeatherIcon icon={data.weatherData.current.weather[0].icon}/>
                        {:catch e}
                            <ExclamationTriangle height="100%" width="100%" class="p-2"/>
                        {/await}
                    </div>
                </td>
                <td style='padding-left:0.25em;'>
                    <h1 style='font-size: 2.5em;'>
                        {#await weatherData}
                            <LoadingText length={3}/>&deg;
                        {:then data}
                            {#key lastExactTemp}
                                {#if get("exactTemp")}
                                    <span title={new Date(data.weatherData.current.dt * 1e3).toLocaleString()}>
                                        {data.weatherData.current.temp}&deg;
                                    </span>
                                {:else}
                                    <span title={new Date(data.weatherData.current.dt * 1e3).toLocaleString()}>
                                        {Math.round(data.weatherData.current.temp)}&deg;
                                    </span>
                                {/if}
                            {/key}
                        {:catch e}
                            <ExclamationTriangle height="1em" width="100%" class="p-2"/>
                        {/await}
                    </h1>
                    <p style='padding-left:0.25em; margin-bottom:0;padding-bottom:0;max-width:35vw;'>
                        {#await weatherData}
                            <LoadingText length={20}/>
                        {:then data}
                            {capitalize(data.weatherData.hourly[0].weather[0].description)}.
                        {:catch e}
                            An error occurred while fetching weather<br>
                            I'll retry in a bit
                        {/await}
                        <br>
                    <div style='text-align: left;'>
                        <button class="hidden-button weekly-toggle-button" on:click={toggleWeekly}>{weekly ? "This Week" : "Today"}</button>
                    </div>
                    <div class="details">
                        {#if weekly}
                            <table>
                                <tr>
                                    {#each orderedDays as day}
                                        <td class="dayName">{day}</td>
                                    {/each}
                                </tr>
                                <tr>
                                    {#await weatherData}
                                        {#each orderedDays as day}
                                            <td>
                                            <span class="weekly-high">
                                                <LoadingText length={3}/>°
                                            </span>
                                                <br>
                                                <span class="weekly-low"><LoadingText length={3}/>°</span>
                                            </td>
                                        {/each}
                                    {:then data}
                                        {#each data.weatherData.daily.slice(0, 7) as day}
                                            <td>
                                            <span class="weekly-high">
                                                {#key lastExactTemp}
                                                    {#if get("exactTemp")}
                                                        {day.temp.max}°
                                                    {:else}
                                                        {Math.round(day.temp.max)}°
                                                    {/if}
                                                {/key}
                                            </span>
                                                <br>
                                                <span class="weekly-low">
                                                {#key lastExactTemp}
                                                    {#if get("exactTemp")}
                                                        {day.temp.min}°
                                                    {:else}
                                                        {Math.round(day.temp.min)}°
                                                    {/if}
                                                {/key}
                                            </span>
                                            </td>
                                        {/each}
                                    {:catch e}
                                        {#each orderedDays as day}
                                            <td>
                                            <span class="weekly-high">
                                                <ExclamationTriangle height="1em" width="100%"/>
                                            </span>
                                                <br>
                                                <span class="weekly-low"><ExclamationTriangle height="1em" width="100%"/></span>
                                            </td>
                                        {/each}
                                    {/await}
                                </tr>
                                <tr>
                                    {#await weatherData}
                                        {#each orderedDays as day}
                                            <td class="precipitation">🌧️<LoadingText length={2}/> %</td>
                                        {/each}
                                    {:then data}
                                        {#each  data.weatherData.daily.slice(0, 7) as day}
                                            <td class="precipitation">🌧️{Math.round(day.pop*1000)/10}%</td>
                                        {/each}
                                    {:catch e}
                                        {#each orderedDays as day}
                                            <td class="precipitation">🌧️<ExclamationTriangle height="1em" class="inline"/> %</td>
                                        {/each}
                                    {/await}
                                </tr>
                            </table>

                        {:else}
                            <table id='we-info-table'>
                                <tr class='weather-tr'>
                                    <td>🌧️</td>
                                    <td>
                                        {#await weatherData}
                                            <LoadingText length={2}/>% chance of rain today
                                        {:then data}
                                            {Math.round(data.weatherData.daily[0].pop*1000)/10}% chance of rain today
                                            {#if data.weatherData.daily[0].pop > 0.2}
                                                <br>
                                                {Math.round(data.weatherData.hourly[0].pop*1000)/10}% chance of rain right now
                                            {/if}
                                        {:catch e}
                                            <ExclamationTriangle height="1em" class="inline"/>% chance of rain today
                                        {/await}
                                    </td>
                                </tr>
                                <tr class='weather-tr'>
                                    <td>💧</td>
                                    <td>
                                        {#await weatherData}
                                            <LoadingText length={2}/>%
                                        {:then data}
                                            {data.weatherData.current.humidity}%
                                        {:catch e}
                                            <ExclamationTriangle height="1em" class="inline"/>%
                                        {/await}
                                        humidity<br>
                                    </td>
                                </tr>
                                <tr class='weather-tr'>
                                    <td>☀️</td>
                                    <td>
                                        UV index:
                                        {#await weatherData}
                                            <span class='badge rounded-pill text-bg-secondary'>
                                                <LoadingText length={2}/> (<LoadingText length={5}/>)
                                            </span>
                                        {:then data}
                                            <span
                                                    class='badge'
                                                    class:variant-filled-error={data.weatherData.current.uvi >= 8}
                                                    class:variant-filled-warning={data.weatherData.current.uvi >= 3 && data.weatherData.current.uvi < 8}
                                                    class:variant-filled-success={data.weatherData.current.uvi < 3}
                                            >
                                                {#if data.weatherData.current.uvi >= 11}
                                                    Extreme
                                                {:else if data.weatherData.current.uvi >= 8}
                                                    Very High
                                                {:else if data.weatherData.current.uvi >= 6}
                                                    High
                                                {:else if data.weatherData.current.uvi >= 3}
                                                    Moderate
                                                {:else}
                                                    Low
                                                {/if}
                                                ({data.weatherData.current.uvi})
                                            </span>

                                        {:catch e}
                                            <span class="badge variant-filled-surface">
                                                <ExclamationTriangle height="1em" class="inline"/>
                                            </span>
                                        {/await}

                                    </td>
                                </tr>
                            </table>
                        {/if}
                    </div>
                </td>
            </tr>
        </table>
    {:else}
        {#if !_GET("preview")}
            <button class="hidden-button stealth-link">
                <img
                        class="disabled-icon"
                        src={window.w_getThemeName() === "light" ? "/img/icons/weather-disabled.svg" : "/img/icons/weather-disabled-white.svg"}
                        alt="Weather disabled icon"
                >
                <span class="disabled-text">
                    Weather has been disabled in settings
                </span>
            </button>
        {:else}
            <span class="preview-text">
                Weather
            </span>
        {/if}
    {/if}

</div>

<style>
    table {
        text-align: center;
    }
    .weather-container {
        width: 65vw;
        min-height: 45vh;
        padding-top: 1em;
        padding-bottom: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
    }
    :global(.layout-default) .weather-container {
        position: fixed;
        top: 53vh;
        left: 1vw;
    }
    :global(.layout-mirrored) .weather-container {
        position: fixed;
        top: 53vh;
        right: 1vw;
    }
    :global(.layout-large) .weather-container, :global(.layout-countdown) .weather-container {
        position: static !important;
        width: auto !important;
        margin-bottom: 1em;
        min-height: 47vh;
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

    :global(.black) .weather-container {
        background-color: transparent;
        border-color: rgba(255, 255, 255, 0.15);
        border-style: solid;
        border-width: initial;
    }

    .weather-icon {
        width: 100px;
        height: 100px;
    }

    .dayName {
        padding-right: 0.5em;
    }

    .weekly-high {
        font-size: 1.35em;
    }

    .weekly-low {
        font-size: 0.75em;
    }

    .preview-text {
        font-size: 10em;
    }

    .precipitation {
        font-size: 0.9em;
    }

    .weekly-toggle-button {
        color: rgba(0, 0, 0, 0.5);
    }
    :global(.dark) .weekly-toggle-button {
        color: rgba(255, 255, 255, 0.5)
    }
    .weekly-toggle-button:hover {
        text-decoration: underline !important;
        cursor: pointer;
    }

    .disabled-icon {
        width: 5rem;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .disabled-text {
        display: block;
        font-size: 0.9em;
        padding-top: 0;
        margin-top: 0;
    }

    .stealth-link {
        color: inherit;
        text-decoration: none;
    }
    .stealth-link:hover {
        color: inherit;
        text-decoration: underline;
    }

    @media(orientation: portrait) {
        .weather-container {
            position: static !important;
            width: auto !important;
            margin-bottom: 1em;
        }
    }

    .details {
        max-width: 70vw;
        overflow-x: auto;
    }
</style>