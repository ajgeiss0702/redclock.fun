<svelte:head>
    <title>Schedule Selector - Red Clock</title>
</svelte:head>
<script>

    import {onMount} from "svelte";
    import {Button, Icon} from "sveltestrap";
    import {goto, prefetch} from "$app/navigation";
    import Schedule from "$lib/schedules/Schedule.svelte";

    export let data;

    onMount(() => {
        if(typeof localStorage.school === 'undefined') {
            goto("/schools");
            return;
        }
        prefetch("/countdown")
    })

    /**
     * Sets the schedule and proceeds to the countdown page
     * @param key The key for the schedule
     */
    function setSchedule(key) {
        localStorage.setItem("schedule", key);
        goto("/countdown")
    }
</script>

<style>
    .header-image {
        height: 15vh;
        margin-top: 2em;
        margin-bottom: 1em;
    }
    .header {
        font-size: 2.5rem;
    }
    .schedule-list {
        width: 100vw;
        background-color: rgba(240, 240, 240, 0.65);
        min-height: 6em;
        padding-top: 1em;
        padding-bottom: 0.75em;
    }
    :global(.dark) .schedule-list {
        background-color: rgba(240, 240, 240, 0.1);
    }
    a, a:visited {
        color: #007bff;
        text-decoration: none;
    }
    a:hover {
        color: #0056b3;
        text-decoration: underline;
    }

    p {
        padding-left: 0.75em;
        padding-right: 0.75em;
    }

</style>
<img class="header-image" alt="Red Clock logo" src="/red_clock.png"><br>

<span class="header">Schedule</span>
<br>
<p>
    Please select which schedule you are on.<br>

    <br>
    <small>Don't know what this website is? <a href="/about">Read about it</a>.</small><br>
    <Button outline secondary on:click={() => goto("/schools")}><Icon name="arrow-left-circle"/> Back</Button>
</p>
<br>
<small>At {typeof localStorage === 'undefined' || typeof localStorage.school === 'undefined' ? '' : data[localStorage.school].display}</small>
<div class="schedule-list">
    {#if typeof localStorage === 'undefined' || typeof localStorage.school === 'undefined'}
        <img style="height: 4em;" src="/img/loading.svg" alt="loading">
    {:else if typeof data[localStorage.school].schedules === 'object' && data[localStorage.school].schedules !== null}
        {#each Object.keys(data[localStorage.school].schedules) as key}
            <Schedule name={data[localStorage.school].schedules[key]} on:click={() => setSchedule(key)}/>
            &nbsp;
        {/each}
    {:else}
        <br>
        Invalid data (no schedule object)
    {/if}
</div>