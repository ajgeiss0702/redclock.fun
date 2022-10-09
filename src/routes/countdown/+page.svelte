<script>
    import CountdownBox from "$lib/countdown/CountdownBox.svelte";
    import Weather from "$lib/countdown/Weather.svelte";
    import Sidebar from "$lib/countdown/Sidebar.svelte";
    import {onMount} from "svelte";
    import {getScheduleCode, getSchoolCode} from "$lib/utils.js";
    import {goto} from "$app/navigation";
    import {schoolExists} from "$lib/countdown/countdown-utils.js";

    onMount(() => {
        if(typeof getSchoolCode() === "undefined" || typeof getScheduleCode() === "undefined") {
            //goto("/");
            return;
        }
    })
</script>

<CountdownBox/>
<Weather/>
<Sidebar/>