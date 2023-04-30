<script>
    import CountdownBox from "$lib/countdown/CountdownBox.svelte";
    import Weather from "$lib/countdown/weather/Weather.svelte";
    import Sidebar from "$lib/countdown/Sidebar.svelte";
    import {getScheduleCode, getSchoolCode} from "$lib/utils";
    import {goto} from "$app/navigation";
    import CustomBackground from "$lib/CustomBackground.svelte";
    import Festive from "$lib/Festive.svelte";
    import {browser} from "$app/environment";
    import {getCookie, setCookie} from "$lib/cookieUtils";

    if(browser) {
        if(typeof getSchoolCode() === "undefined" || typeof getScheduleCode() === "undefined") {
            goto("/");
        } else {
            if(!getCookie("school") && localStorage.school) {
                setCookie("school", localStorage.school);
            }
            if(!getCookie("schedule") && localStorage.schedule) {
                setCookie("schedule", localStorage.schedule)
            }
        }
    }

    export let data;


    let withWeather = data.school ? data.school === "rmhs" : true;

    console.log({school: !!data.school})

</script>


<CustomBackground/>
<CountdownBox bind:withWeather={withWeather} start={data.startTime}/>
<Weather bind:shown={withWeather}/>
<Sidebar/>

<Festive/>