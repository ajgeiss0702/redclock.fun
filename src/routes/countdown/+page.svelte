<script>
    import CountdownBox from "$lib/countdown/CountdownBox.svelte";
    import Weather from "$lib/countdown/weather/Weather.svelte";
    import Sidebar from "$lib/countdown/Sidebar.svelte";
    import {onMount} from "svelte";
    import {getScheduleCode, getSchoolCode} from "$lib/utils.js";
    import {goto} from "$app/navigation";

    onMount(() => {
        if(typeof getSchoolCode() === "undefined" || typeof getScheduleCode() === "undefined") {
            goto("/");
            return;
        }
    })

    let withWeather = true;
</script>

<CountdownBox bind:withWeather={withWeather}/>
<Weather bind:shown={withWeather}/>
<Sidebar/>