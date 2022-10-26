<script>
    import {onDestroy, onMount} from "svelte";
    import {get, off, onChange} from "$lib/settings"

    export let icon;

    const icons = {
        "01d": "CLEAR_DAY",
        "01n": "CLEAR_NIGHT",
        "02d": "PARTLY_CLOUDY_DAY",
        "02n": "PARTLY_CLOUDY_NIGHT",
        "03d": "CLOUDY",
        "03n": "CLOUDY",
        "04d": "PARTLY_CLOUDY_DAY",
        "04n": "PARTLY_CLOUDY_NIGHT",
        "09d": "RAIN",
        "09n": "RAIN",
        "10d": "RAIN",
        "10n": "RAIN",
        "11d": "RAIN",
        "11n": "RAIN",
        "13d": "SNOW",
        "13n": "SNOW",
        "50d": "FOG",
        "50n": "FOG"
    }

    let canvas;
    let skycons;

    onMount(async () => {
        let color = document.body.classList.contains("dark") ? "white" : "black";

        await import("$lib/countdown/weather/skycons.js")

        skycons = new Skycons({color});

        skycons.add(canvas, icons[icon]);

        if(get("animatedWeatherIcon")) {
            skycons.play();
        }

        onChange("animatedWeatherIcon", checkAnimated)
    });

    onDestroy(() => {
        off("animatedWeatherIcon", checkAnimated)
    });

    function checkAnimated() {
        if(get("animatedWeatherIcon")) {
            skycons.play();
        } else {
            skycons.pause();
        }
    }
</script>
<canvas height='100' width='100' bind:this={canvas}></canvas>