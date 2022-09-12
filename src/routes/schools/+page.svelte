<svelte:head>
    <title>School Selector - Red Clock</title>
</svelte:head>
<style>
    .header-image {
        height: 15vh;
        margin-top: 2em;
        margin-bottom: 1em;
    }
    .header {
        font-size: 2.5rem;
    }
    .school-list {
        width: 100vw;
        background-color: rgba(240, 240, 240, 0.65);
        min-height: 6em;
        padding: 0;
    }
    :global(.dark) .school-list {
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

</style>
<script>
    import {onMount} from "svelte";
    import School from "$lib/schoolselector/School.svelte";


    export let data;

    let first = true;

    onMount(() => {
        first = localStorage.school === undefined;
    });

    /**
     * Sets the school and proceeds to schedule selection
     * @param key The key for the school
     */
    function setSchool(key) {
        localStorage.setItem("school", key);
        location.href = "/schedules";
    }

</script>
<img class="header-image" alt="Red Clock logo" src="/red_clock.png"><br>

<span class="header">Welcome</span><br>
<br>
{#if first}
    This seems to be your first time using this site, so you need to select which school you would like to see the countdown for.
{:else}
    Please select a school
{/if}

<br>
<br>
<small>Don't know what this website is? <a href="/about">Read about it</a>.</small><br>
<br>
<br>
<br>

<div class="school-list">
    {#each Object.keys(data) as key}
        <School name="{data[key].display}" image="{data[key].logo}" on:click={() => setSchool(key)}/>
        &nbsp;
    {/each}
</div>