<script>
    import {periodString} from "$lib/countdown/countdown.js";
    import {makeDate} from "$lib/countdown/countdown-utils.js";
    import {dateString} from "$lib/utils.js";
    import {onDestroy, onMount} from "svelte";
    import {onChange, off} from "$lib/settings";

    export let schedule;

    let update = () => {
        schedule = schedule;
    }

    onMount(() => {
        onChange("24hourTime", update);
    })

    onDestroy(() => {
        off("24hourTime", update);
    })
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