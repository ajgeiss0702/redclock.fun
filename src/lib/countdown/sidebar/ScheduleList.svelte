<script>

    import {currentTime, currentClass} from "$lib/countdown/CountdownBox.svelte";
    import {getCurrentSchedule} from "$lib/countdown/countdown-utils.ts";
    import {onDestroy, onMount} from "svelte";
    import {dateString} from "$lib/utils.js";
    import ScheduleTable from "$lib/countdown/sidebar/ScheduleTable.svelte";
    import AnalogRedClock from "$lib/countdown/sidebar/AnalogRedClock.svelte";
    import {page} from "$app/stores";

    $: if(typeof updateInterval !== "undefined") {
        update($currentClass);
    }
    async function update() {
        schedule = await getCurrentSchedule($page.data.school, $page.data.schedule);
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
    <br>
    <AnalogRedClock/>
    <br>

    <h1>{dateString($currentTime)}</h1>
    <br>
    <span style="font-size: 0.9em">
        If there are any issues with the schedule, or you want to make sure I know about a future schedule, please
    notify me by emailing <a href="mailto:schedule@redclock.fun">schedule@redclock.fun</a>
    </span>

    <ScheduleTable {schedule} currentPeriod={$currentClass}/>
    <br>
    <br>
    <br>
    <a href="/schedule-preview" class="btn variant-glass-secondary">Schedule Preview</a>
    <br>
    <br>
    <br>
    <br>
    <br>

    TZ: {new Date().getTimezoneOffset()}

</div>
