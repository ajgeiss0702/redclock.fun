<script>

    import {currentTime, periodString} from "$lib/countdown/countdown.js";
    import {getCurrentSchedule, makeDate} from "$lib/countdown/countdown-utils.js";
    import {onDestroy, onMount} from "svelte";
    import {dateString} from "$lib/utils.js";
    import ScheduleTable from "$lib/countdown/sidebar/ScheduleTable.svelte";

    $: if(typeof updateInterval !== "undefined") {
        update($periodString);
    }
    async function update() {
        schedule = await getCurrentSchedule();
    }

    $: console.log("'" + $periodString.substring("until ".length) + "'p");

    let updateInterval;
    onMount(() => {
        update();

        updateInterval = setInterval(update, 15e3);
    });

    onDestroy(() => {
        clearInterval(updateInterval);
    })
    let schedule = {};
</script>
<style>
    div {
        text-align: center;
    }
</style>

<div>
    <h1>{dateString($currentTime)}</h1>

    <ScheduleTable {schedule}/>

    TZ: {new Date().getTimezoneOffset()}

</div>
