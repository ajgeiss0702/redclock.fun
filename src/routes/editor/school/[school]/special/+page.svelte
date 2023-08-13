<script lang="ts">
    import {capitalize, daysOfWeek, shortMonths} from "$lib/utils";

    export let data;

    function dateDisplayMap(a: string) {
        const parts = a.split("/");
        const month = parts[0];
        const date = parts[1];

        return shortMonths[month-1] + " " + date;
    }
</script>
<h1>Special Schedules</h1>
<br>
<div class="limit mx-auto">
    <br>
    <h2>Day</h2>
    <hr>
    {#each Object.entries(data.school.specials.day) as [scheduleName, data]}
        <a href="specials/day/{scheduleName}" class="hidden-link">
            {daysOfWeek[Number(scheduleName)]}
            <hr>
        </a>
    {/each}

    <br>
    <h2>Date</h2>
    <hr>
    {#each Object.entries(data.school.specials.date) as [scheduleName, data]}
        {@const displayName = scheduleName.split(",").map(dateDisplayMap).join(", ")}
        <a href="specials/date/{scheduleName.replaceAll('/', '-')}" class="hidden-link">
            {capitalize(displayName)}
            <hr>
        </a>
    {/each}
</div>