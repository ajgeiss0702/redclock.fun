<svelte:head>
    <title>School Selector - Red Clock</title>
</svelte:head>
<style>
    div {
        text-align: center;
    }
    .header-image {
        height: 15vh;
        width: 15vh;
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
        padding-top: 1em;
        padding-bottom: 0.75em;
    }

    :global(.dark) .school-list {
        background-color: rgba(240, 240, 240, 0.1);
    }

    :global(.black) .school-list {
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
<script>
    import {onDestroy, onMount} from "svelte";
    import School from "$lib/schools/School.svelte";
    import {goto, preloadData} from "$app/navigation";
    import {page} from "$app/stores";
    import {browser} from "$app/environment";
    import {setCookie} from "$lib/cookieUtils.js";

    export let data;

    let first = true;

    let reSelecting = browser ? $page.url.searchParams.has("reselect") : false;

    let prefetchTimeout;

    onMount(() => {
        first = localStorage.school === undefined;
        prefetchTimeout = setTimeout(() => preloadData("/schedules"), 500)
    });

    onDestroy(() => {
        clearTimeout(prefetchTimeout);
    })

    /**
     * Sets the school and proceeds to schedule selection
     * @param key The key for the school
     */
    function setSchool(key) {
        localStorage.setItem("school", key);
        setCookie("school", key);
        goto("/schedules")
    }

</script>
<div>
    <img class="header-image inline-block" alt="Red Clock logo" src="/red_clock.webp" height="300" width="300"><br>

    <span class="header">Welcome</span><br>

    <p>
        {#if first && !reSelecting}
            This seems to be your first time using this site, so you need to select which school you would like to see the countdown for.
        {:else if reSelecting}
            <b>The school you had selected before no longer exists. Please select a new one.</b>
        {:else}
            Please select a school
        {/if}

        <br>
        <br>
        <small>Don't know what this website is? <a href="/about">Read about it</a>.</small><br>
    </p>
    <br>
    <br>

    <div class="school-list">
        {#each Object.keys(data) as key}
            <School code={key} name="{data[key].display}" image="{data[key].logo}" on:click={() => setSchool(key)}/>
            &nbsp;
        {/each}
    </div>
</div>