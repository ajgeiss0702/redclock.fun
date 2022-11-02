<script>
    import {create, get, onChange} from "$lib/settings.ts";
    import {onDestroy, onMount} from "svelte";
    import {getSchoolCode, daysOfWeek, capitalize, getAPIPrefix} from "$lib/utils";
    import LoadingText from "$lib/LoadingText.svelte";
    import WeatherIcon from "$lib/countdown/weather/WeatherIcon.svelte";
    import {browser, dev} from "$app/environment";

    export let shown = true;
    export let enabled = true;

    const orderedDays = [
        "Today",
        "Tomorrow"
    ];

    const day = new Date().getDay();
    for (let i = day+2; i !== day; i++) {
        if(i >= 7) {
            i = 0;
        }

        orderedDays.push(daysOfWeek[i]);
    }

    let updateInterval;

    let weatherData = new Promise(() => {});

    onMount(() => {
        updateInterval = setInterval(update, 10 * 60 * 1000);

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

    function update() {
        calcShown();
        enabled = get("enableWeather") && shown;

        if(!enabled) return;

        fetch(getAPIPrefix() + "/api/weather/get/" + getSchoolCode())
            .then(r => r.json())
            .then(d => {
                weatherData = new Promise((resolve) => resolve(d));
                retryLength = 5;
            })
            .catch(e => {
                console.warn("Failed to fetch weather: " + e + ". Retrying in " + retryLength + " seconds");
                clearTimeout(retryTimeout);
                retryTimeout = setTimeout(update, retryLength);
                retryLength += 5;
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
<style>
    table {
        text-align: center;
    }
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

    :global(.black) .weather-container {
        background-color: transparent;
        border-color: rgba(255, 255, 255, 0.15);
        border-style: solid;
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
        <table>
            <tr>
                <td>
                    <div class="weather-icon">
                        {#await weatherData}
                            <LoadingText circle/>
                        {:then data}
                            <WeatherIcon icon={data.weatherData.current.weather[0].icon}/>
                        {/await}
                    </div>
                </td>
                <td style='padding-left:0.25em;'>
                    <h1 style='font-size: 2.5em;'>
                        {#await weatherData}
                            <LoadingText length={3}/>&deg;
                        {:then data}
                            {#if get("exactTemp")}
                                {data.weatherData.current.temp}&deg;
                            {:else}
                                {Math.round(data.weatherData.current.temp)}&deg;
                            {/if}
                        {/await}
                    </h1>
                    <p style='padding-left:0.25em; margin-bottom:0;padding-bottom:0;max-width:35vw;'>
                        {#await weatherData}
                            <LoadingText length={20}/>
                        {:then data}
                            {capitalize(data.weatherData.hourly[0].weather[0].description)}.
                        {/await}
                        <br><br>
                    <div style='text-align: left;'>
                        <span class="weekly-toggle-button" on:click={toggleWeekly}>{weekly ? "This Week" : "Today"}</span>
                    </div>
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
                                                {#if get("exactTemp")}
                                                    {day.temp.max}°
                                                {:else}
                                                    {Math.round(day.temp.max)}°
                                                {/if}
                                            </span>
                                            <br>
                                            <span class="weekly-low">
                                                {#if get("exactTemp")}
                                                    {day.temp.min}°
                                                {:else}
                                                    {Math.round(day.temp.min)}°
                                                {/if}
                                            </span>
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
                                        <td class="precipitation">🌧️{day.pop}%</td>
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
                                        {data.weatherData.daily[0].pop}% chance of rain today
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
                                                class='badge rounded-pill'
                                                class:text-bg-danger={data.weatherData.current.uvi >= 8}
                                                class:text-bg-warning={data.weatherData.current.uvi >= 3 && data.weatherData.current.uvi < 8}
                                                class:text-bg-success={data.weatherData.current.uvi < 3}
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
                                    {/await}

                                </td>
                            </tr>
                        </table>
                    {/if}
                </td>
            </tr>
        </table>
    {:else}
        No weather
    {/if}

</div>