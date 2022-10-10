<script>
    import {periodString} from "$lib/countdown/countdown.js";
    import {makeDate} from "$lib/countdown/countdown-utils.js";
    import {dateString} from "$lib/utils.js";

    export let schedule;
</script>
<style>
    table {
        color: inherit;
    }
    td {
        color: inherit !important;
    }
</style>
<table class="table table-striped">
    <thead>
    <tr>
        <th>Hour</th>
        <th>Time</th>
    </tr>
    </thead>
    <tbody>
    {#each Object.keys(schedule) as className}
        <tr class:table-secondary={$periodString.substring("until ".length) === className}>
            <td>{className}</td>
            <td>{dateString(makeDate(schedule[className]))}</td>
        </tr>
    {/each}
    </tbody>
</table>