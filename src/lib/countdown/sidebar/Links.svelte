<h1>Links</h1>
<br>
<a class="btn variant-filled-surface" href="https://discord.gg/shSg6r8" target="_blank" rel="noreferrer">
    <img src="/img/icons/discord.svg" style="height: 1em;" alt="Discord icon"> Discord
</a><br>
<br>
<a class="btn variant-filled-secondary" href="mailto:support@redclock.fun">
    Support / Feedback
</a><br>
<br>
<a class="btn variant-glass-error" href="/desktop">Desktop App</a><br>
<br>
<a class="btn variant-ringed-surface" href="/lightweight">Lightweight</a><br>
<br>
<a class="btn variant-glass-primary" href="/about">About Red Clock</a><br>
<br>
<a class="btn variant-ringed-surface" href="/quotes">Quotes</a>
<br>











{#if show}
    <br>
    <br>
    <div class="x-container">
        <button class="x" on:click={() => show = false}>x</button>
    </div>
    {#if msComponent}
        <svelte:component this={msComponent}/>
    {:else}
        Loading..
    {/if}
    <br>
    <br>
{/if}

<svelte:window on:keypress={keyPress}/>
<script lang="ts">
    import {dev} from "$app/environment";
    import {onMount} from "svelte";

    let msComponent = false;

    onMount(async () => {
        msComponent = (await import("$lib/countdown/sidebar/minesweeper/Minesweeper.svelte")).default;
    })

    let show = dev;

    function keyPress(event) {
        if(event.key !== "g") return;
        show = !show;
    }
</script>
<style>
    .x-container {
        text-align: right;
        padding-right: 5em;
    }
    .x {
        padding: 0.4em 0.3em 0.7em 0.25em;
        display: inline-block;
        border-radius: 12em;
        line-height: 0;
    }
    .x:hover {
        background-color: red;
        color: white;
        cursor: pointer;
    }
</style>