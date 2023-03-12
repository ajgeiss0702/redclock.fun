<script>
    import {makeDate} from "$lib/countdown/countdown-utils.ts";
    import {dateString} from "$lib/utils.js";
    import {onDestroy, onMount} from "svelte";
    import {onChange, off} from "$lib/settings";

    export let schedule;
    export let currentPeriod = "";

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
    th {
        text-align: center;
    }
</style>
<table class="table">
    <thead>
        <tr>
            <th>Hour</th>
            <th>Time</th>
        </tr>
    </thead>
    <tbody>
    {#each Object.keys(schedule) as className}
        <tr class:table-row-checked={currentPeriod === className}>
            <td>{className}</td>
            <td>{dateString(makeDate(schedule[className]))}</td>
        </tr>
    {/each}
    </tbody>
</table>