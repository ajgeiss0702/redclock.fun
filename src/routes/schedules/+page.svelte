<svelte:head>
    <title>Schedule Selector - Red Clock</title>
</svelte:head>
<script>

    import {onMount} from "svelte";
    import {Button, Icon} from "sveltestrap";

    onMount(() => {
        if(typeof localStorage.school === 'undefined') {
            location.href = "/schools";
        }
    })
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
        padding: 0;
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

</style>
<img class="header-image" alt="Red Clock logo" src="/red_clock.png"><br>

<span class="header">Schedule</span><br>
<br>
Please select which schedule you are on.<br>


<br>
<br>
<small>Don't know what this website is? <a href="/about">Read about it</a>.</small><br>
<Button outline secondary on:click={() => location.href="/schools"}><Icon name="arrow-left-circle"/> Back</Button>