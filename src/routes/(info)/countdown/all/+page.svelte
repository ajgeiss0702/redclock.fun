<script>
    import Countdown from "$lib/countdown/all/Countdown.svelte";

    export let data;
</script>

<br>

{#each Object.entries(data) as [schoolCode, schoolData]}
    <h2>{schoolData.display}</h2>
    {#each Object.entries(schoolData.schedules) as [scheduleCode, scheduleDisplay]}
        <Countdown
                school={schoolCode}
                schoolDisplay={schoolData.display}

                schedule={scheduleCode}
                {scheduleDisplay}
                />
    {:else}
        No schedules?
    {/each}
    <br><br>
{:else}
    No schools?
{/each}