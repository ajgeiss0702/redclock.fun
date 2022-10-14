<script>

    import {currentTime, periodString} from "$lib/countdown/countdown.js";
    import {getCurrentSchedule, makeDate} from "$lib/countdown/countdown-utils.js";
    import {onDestroy, onMount} from "svelte";
    import {dateString} from "$lib/utils.js";
    import ScheduleTable from "$lib/countdown/sidebar/ScheduleTable.svelte";
    import AnalogRedClock from "$lib/countdown/sidebar/AnalogRedClock.svelte";

    $: if(typeof updateInterval !== "undefined") {
        update($periodString);
    }
    async function update() {
        schedule = await getCurrentSchedule();
    }

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
    <AnalogRedClock/>
    <br>

    <h1>{dateString($currentTime)}</h1>
    <br>

    <ScheduleTable {schedule}/>
    <br>
    Issue with the schedule? Notify me by emailing <a href="mailto:schedule@redclock.fun">schedule@redclock.fun</a>
    <br>
    <br>
    <br>
    <br>

    TZ: {new Date().getTimezoneOffset()}

</div>
