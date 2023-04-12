<script>
    import {browser} from "$app/environment";

    export let school;
    export let schoolDisplay;

    export let schedule;
    export let scheduleDisplay;
</script>
<style>
    div {
        display: inline-block;
    }
    .wrapper {
        border: 3px solid rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        margin: 0.5em;
        padding: 1em;

        cursor: pointer;
    }
    :global(.dark) .wrapper {
        border-color: rgba(255, 255, 255, 0.5);
    }
    .preview {
        width: 20vw;
        height: 20vh;
    }
    iframe {
        width: 100vw;
        height: 100vh;
        transform: scale(20%);
        position: absolute;
        margin: -40vh -40vw;
        z-index: -1;
    }
</style>
<div class="wrapper">
    <div class="preview layout-preview">
        {#if browser}
            <iframe src="/countdown?layout=countdown&school={school}&schedule={schedule}" title="{schoolDisplay} - {scheduleDisplay}"></iframe>
        {/if}
    </div>
    <br>
    <span class="selectable">
        {scheduleDisplay}
    </span>
</div>