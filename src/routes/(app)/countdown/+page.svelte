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
    import {page} from "$app/stores";
    import {isAprilFools} from "$lib/aprilFools";

    if(browser) {
        if(!localStorage.school && getCookie("school")) {
            localStorage.school = getCookie("school");
        }
        if(!localStorage.schedule && getCookie("schedule")) {
            localStorage.schedule = getCookie("schedule");
        }

        if(typeof getSchoolCode() === "undefined" || typeof getScheduleCode() === "undefined") {
            goto("/");
        } else {
            if(!getCookie("school") && localStorage.school) {
                setCookie("school", localStorage.school);
            }
            if(!getCookie("schedule") && localStorage.schedule) {
                setCookie("schedule", localStorage.schedule)
            }

            const searchParams = $page.url.searchParams;
            if(searchParams.get("school") && searchParams.get("schedule") && searchParams.get("set") === "") {
                localStorage.school = searchParams.get("school");
                localStorage.schedule = searchParams.get("schedule");
                window.history.replaceState({}, document.title, "/countdown");
            }
        }
    }

    export let data;


    let withWeather = data.school ? data.school === "rmhs" : true;

    console.debug({data})

</script>


<div class="big-container" class:flip={$isAprilFools}>

    <CustomBackground/>
    <CountdownBox bind:withWeather={withWeather} start={data.startTime}/>
    <Weather bind:shown={withWeather}/>
    <Sidebar/>

    <Festive/>

</div>


<style>
   /* @media(orientation: landscape) {
        .big-container.flip {
            position: absolute;
            bottom: 0;

            max-height: 100vh;
            overflow-y: hidden;
            display: flex;
            flex-direction: column-reverse;
        }
    }
    @media(orientation: portrait) {
        .big-container.flip {
            max-height: 100vh;
            overflow: auto;
        }
    }*/

   .big-container.flip {
       max-height: 100vh;
       overflow: auto;
   }
</style>