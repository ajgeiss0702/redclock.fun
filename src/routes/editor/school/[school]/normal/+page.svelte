<script>
    import ScheduleEditor from "../../../../../lib/editor/ScheduleEditor.svelte";

    export let data;
</script>
<h1>Normal Schedules</h1>
The "normal" schedule is the schedule that Red Clock will follow if there are no "special" schedules to follow.<br>
<br>

<ScheduleEditor schedule={data.schedule} schedules={data.schedules}/>