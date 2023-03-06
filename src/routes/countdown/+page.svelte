<script>
    import CountdownBox from "$lib/countdown/CountdownBox.svelte";
    import Weather from "$lib/countdown/weather/Weather.svelte";
    import Sidebar from "$lib/countdown/Sidebar.svelte";
    import {getScheduleCode, getSchoolCode} from "$lib/utils.js";
    import {goto} from "$app/navigation";
    import CustomBackground from "$lib/CustomBackground.svelte";
    import Festive from "$lib/Festive.svelte";
    import {browser} from "$app/environment";

    if(browser) {
        if(typeof getSchoolCode() === "undefined" || typeof getScheduleCode() === "undefined") {
            goto("/");
        }
    }

    let withWeather = true;
</script>


<CustomBackground/>
<CountdownBox bind:withWeather={withWeather}/>
<Weather bind:shown={withWeather}/>
<Sidebar/>

<Festive/>