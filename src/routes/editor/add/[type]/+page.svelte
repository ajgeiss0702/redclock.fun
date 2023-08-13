<script>
    import {page} from "$app/stores";
    import SchedulesEditor from "$lib/editor/SchedulesEditor.svelte";
</script>
<br>
<div class="limit text-left mx-auto">
    <h1>Add {$page.params.type}</h1>
    <div class="card p-4">
        <label class="label">
            <span>School Code</span>
            <input class="input px-2 w-32" type="text" placeholder="rmhs" name="code">
        </label>

        <label class="label">
            <span>School Name</span>
            <input class="input px-2 w-96" type="text" placeholder="Red Mountain High School" name="display">
        </label>

        <label class="label">
            <span>Logo URL</span>
            <input class="input px-2 w-96" type="text" placeholder="https://redclock.fun/img/schools/rmhs.webp" name="logo">
        </label>

        <label class="label">
            <span>Global Offset (seconds)</span>
            <input class="input px-2 w-20" type="number" value={0}>
        </label>

        <label class="label">
            <span>Timezone Offset (seconds)</span>
            <input class="input px-2 w-20" type="number" placeholder="420">
        </label>

        <br>
        <h2>Schedules</h2>
        <SchedulesEditor schedules={{}} form={true}/>
    </div>
</div>