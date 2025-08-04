<script>

    import {onMount} from "svelte";
    import {goto, invalidate, preloadCode} from "$app/navigation";
    import Schedule from "$lib/schedules/Schedule.svelte";
    import {getSchoolCode} from "$lib/utils.js";
    import {page} from "$app/stores";
    import {browser} from "$app/environment";
    import ArrowLeftCircle from "svelte-bootstrap-icons/lib/ArrowLeftCircle.svelte"
    import {setCookie} from "$lib/cookieUtils.js";

    export let data;

    if(browser) {
        if(typeof getSchoolCode() === 'undefined') {
            goto("/schools");
        } else {
            preloadCode("/countdown");
            if(getSchoolCode() && !localStorage.school) {
                localStorage.school = getSchoolCode();
            }
        }
    }

    let reSelecting = browser ? $page.url.searchParams.has("reselect") : false;

    /**
     * Sets the schedule and proceeds to the countdown page
     * @param key The key for the schedule
     */
    function setSchedule(key) {
        localStorage.setItem("schedule", key);
        setCookie("schedule", key);
        goto("/countdown")
    }

    onMount(() => {
        if(Object.keys(data[getSchoolCode()]).length === 1) {
            setSchedule(Object.keys(data[getSchoolCode()])[0]);
        }
    })
</script>

<svelte:head>
    <title>{!getSchoolCode() ? '' : data[getSchoolCode()].display + ' '}Schedule Selector - Red Clock</title>
</svelte:head>

<div>
    <img class="header-image inline-block" alt="Red Clock logo" src="/red_clock.webp"><br>

    <span class="header">Schedule</span>
    <br>
    <p>
        {#if reSelecting}
            <b>The schedule you had selected before no longer exists. Please select a new one.</b>
        {:else}
            Please select which schedule you are on.
            <br>
            <br>
            <small>Don't know what this website is? <a href="/about">Read about it</a>.</small>
        {/if}
        <br>
        <a class="btn variant-ringed-surface hidden-link" href="/schools">
            <ArrowLeftCircle/> &nbsp; Back
        </a>
    </p>
    <br>
    <small>At {!getSchoolCode() ? '' : data[getSchoolCode()].display}</small>
    <div class="schedule-list">
        {#if data[getSchoolCode()] && data[getSchoolCode()].schedules}
            {#each Object.keys(data[getSchoolCode()].schedules) as key}
                <Schedule code={key} school={getSchoolCode()} name={data[getSchoolCode()].schedules[key]} on:click={() => setSchedule(key)}/>
                &nbsp;
            {/each}
        {:else}
            <br>
            Invalid data (no schedule object)
        {/if}
    </div>
</div>

<style>
    div {
        text-align: center;
    }
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
    :global(.black) .schedule-list {
        background-color: rgba(125, 125, 125, 0.1);
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