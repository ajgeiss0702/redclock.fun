<script>
    import LoadingText from "$lib/LoadingText.svelte";
    import {onDestroy, onMount} from "svelte";
    import {commas} from "$lib/utils.js";
    import AnimateNumber from "$lib/AnimateNumber.svelte";

    let nowUsers = new Promise(() => {});
    let nowUsersNumber;

    let yesterdayUsers = new Promise(() => {});
    let yesterdayUsersNumber;

    let todayUsers = new Promise(() => {});
    let todayUsersNumber;

    let updateInterval;
    onMount(() => {
        update();
        updateInterval = setInterval(update, 10e3);
    });

    onDestroy(() => {
        clearInterval(updateInterval);
    })

    function update() {
        let nowPromise = fetch("https://api.redclock.fun/checkin/").then(r => r.text());
        nowPromise.then(n => {
            nowUsers = nowPromise;
            nowUsersNumber = n;
        });
        let yesterdayPromise = fetch("https://api.redclock.fun/checkin/yesterday").then(r => r.text())
        yesterdayPromise.then(n => {
            yesterdayUsers = yesterdayPromise;
            yesterdayUsersNumber = n;
        });
        let todayPromise = fetch("https://api.redclock.fun/checkin/today").then(r => r.text())
        todayPromise.then(n => {
            todayUsers = todayPromise;
            todayUsersNumber = n;
        });
    }
</script>
<style>
    h1 {
        line-height: 15vh;
        font-size: 15vh;
        padding: 0;
        margin: 0;
        font-weight: normal;
    }
    .numbers {
        font-size: 1.25em;
        margin-top: -0.6em;
    }
</style>
<h1>
    {#await nowUsers}
        <LoadingText length="3"/>
    {/await}
    <span id="nowUsers">
        <AnimateNumber number={nowUsersNumber}/>
    </span>
</h1>
<div class="numbers">
    <span class="text-secondary" id="yesterdayUsers">
        {#await yesterdayUsers}
            <LoadingText length="4"/>
        {:then users}
            {commas(users)}
        {/await}
    </span>
    &nbsp;
    <span id="todayUsers">
        {#await todayUsers}
            <LoadingText length="4"/>
        {:then users}
            {commas(users)}
        {/await}
    </span>
</div>