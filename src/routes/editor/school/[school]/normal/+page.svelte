<script>
    import ScheduleEditor from "$lib/editor/ScheduleEditor.svelte";

    export let data;

    let scheduleOut;
</script>
<h1>Normal Schedules</h1>
The "normal" schedule is the schedule that Red Clock will follow if there are no "special" schedules to follow.<br>
<br>

<ScheduleEditor schedule={data.schedule} schedules={data.schedules} bind:scheduleOut={scheduleOut}/>

<div class="preview fixed right-0">
    <pre class="text-left inline-block">{JSON.stringify(scheduleOut, null, '\t')}</pre>
</div>
<style>
    .preview {
        top: 4rem;
        max-height: calc(100vh - 4rem);
        overflow: auto;
    }
    @media (max-width: 1050px) {
        .preview {
            display: none;
        }
    }
</style>