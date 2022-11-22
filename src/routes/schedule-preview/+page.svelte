<script>
    import {Icon} from "sveltestrap";
    import ScheduleTable from "$lib/countdown/sidebar/ScheduleTable.svelte";
    import {getScheduleFor} from "$lib/countdown/countdown-utils.js";

    let dateInput;

    let schedule = {}

    $: updateSchedule(dateInput);

    async function updateSchedule(dateInput) {
        if(typeof dateInput !== "string") {
            schedule = {};
            return;
        }
        let date = new Date(dateInput);
        date.setDate(date.getDate() + 1);
        console.log(date);
        schedule = await getScheduleFor(date);
    }

</script>
<style>
    div {
        text-align: center;
        padding-top: 0.5em;
    }
    .back {
        position: fixed;
        top: 1em;
        left: 1em;
    }
    @media (max-width: 600px) {
        .back {
            position: static;
            margin-left: 1em;
            margin-top: 1em;
        }
    }
</style>
<a href="/countdown" class="btn btn-outline-secondary back"><Icon name="arrow-left-circle"/> Back to countdown</a>
<div class="container">
    <h1>Schedule preview</h1>

    Select a date below to see the schedule for that day.<br>
    <br>
    <b>NOTE: Sometimes special schedules (e.g. assembly) are not put in until a few days before.</b><br>

    If you have the schedule and do not see it in here, please make sure I know about it
    by emailing it to me: <a href="mailto:schedules@redclock.fun">schedules@redclock.fun</a><br>
    <br>
    <label for="date-preview_date-select">Select a date:</label> <input id="date-preview_date-select" type="date" bind:value={dateInput}>
    <br>
    <br>
    <ScheduleTable {schedule}/>
</div>