<script lang="ts">
    import {capitalize, daysOfWeek, shortMonths} from "$lib/utils";
    import TrashFill from "svelte-bootstrap-icons/lib/TrashFill.svelte";
    import {enhance} from "$app/forms";

    export let data;

    function dateDisplayMap(a: string) {
        const parts = a.split("/");
        const month = parts[0];
        const date = parts[1];

        return shortMonths[month-1] + " " + date;
    }

    let newDay = "";
    $: disallowAddingDay = newDay === "" || Object.keys(data.school.specials.day).includes(newDay+"");

    let newDate = "";
    $: disallowAddingDate = newDate === "" || Object.keys(data.school.specials.date).includes(newDate)

    let year = new Date().getFullYear();
    $: specialDates = Object.entries(data.school.specials.date)
        .sort((a, b) => {
            const aParts = a[0].split(",");
            const bParts = b[0].split(",");

            const aDate = new Date(aParts[0] + "/" + year);
            const bDate = new Date(bParts[0] + "/" + year);
            return aDate - bDate;
        });

</script>
<h1>Special Schedules</h1>
<br>
<div class="small-limit mx-auto mb-32">
    <br>
    <h2>Day</h2>
    <hr>
    <form method="POST" use:enhance>
        {#each Object.entries(data.school.specials.day) as [scheduleName, data]}
            <div class="relative pt-1">
                <a href="specials/day/{scheduleName}" class="hidden-link relative bottom-1">
                    {daysOfWeek[Number(scheduleName)]}
                </a>
                <hr>
                <button
                        class="absolute right-0 top-0 btn btn-sm variant-ghost-error"
                        formaction="?/removeDay&day={scheduleName}"
                        on:click={(e) => {
                            if(!confirm("Are you sure? This cannot be undone!")) e.preventDefault()
                        }}
                >
                    <TrashFill/>
                </button>
            </div>
        {/each}
    </form>
    <hr class="mt-5">
    <select bind:value={newDay} class="select inline-block w-32 my-1 py-0">
        <option value=""></option>
        {#each daysOfWeek as day, i}
            <option value="{i}">{day}</option>
        {/each}
    </select>
    <a
            href="specials/day/{newDay}?new"
            class="btn btn-sm variant-ghost-success"
            disabled={disallowAddingDay}
            on:click={(e) => {
                if(disallowAddingDay) e.preventDefault();
            }}
    >
        Add
    </a>
    <hr>
    <br>

    <br>
    <h2>Date</h2>
    <hr>
    <form method="POST" use:enhance>
        {#each specialDates as [scheduleName, data]}
            {@const displayName = scheduleName.split(",").map(dateDisplayMap).join(", ")}
            <div class="relative pt-1">
                <a href="specials/date/{scheduleName.replaceAll('/', '-')}" class="hidden-link relative bottom-1">
                    {displayName}
                </a>
                <hr>
                <button
                        class="absolute right-0 top-0 btn btn-sm variant-ghost-error"
                        formaction="?/removeDate&date={scheduleName}"
                        on:click={(e) => {
                            if(!confirm("Are you sure? This cannot be undone!")) e.preventDefault()
                        }}
                >
                    <TrashFill/>
                </button>
            </div>
        {/each}
    </form>
    <hr class="mt-5">
    <input bind:value={newDate} class="select inline-block w-32 my-1 py-0">
    <a
            href="specials/date/{newDate.replaceAll('/', '-')}?new"
            class="btn btn-sm variant-ghost-success"
            disabled={disallowAddingDate}
            on:click={(e) => {
                if(disallowAddingDate) e.preventDefault();
            }}
    >
        Add
    </a>
    <hr>
</div>
<style>
    input {
        background-color: transparent;
    }
    a[disabled=true] {
        cursor: not-allowed !important;
        opacity: 0.5 !important;
    }
    .small-limit {
        width: calc(min(90vw, 20em))
    }
</style>