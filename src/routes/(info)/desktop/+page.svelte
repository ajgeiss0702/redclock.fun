<svelte:head>
    <title>Red Clock Desktop App</title>
</svelte:head>
<script>
    import {getAPIPrefix} from "$lib/utils.js";
    import DateStamp from "$lib/DateStamp.svelte";
    import ArrowLeftCircle from "svelte-bootstrap-icons/lib/ArrowLeftCircle.svelte"

    export let data
</script>
<style>
    div {
        text-align: center;
    }

    .back {
        position: fixed;
        top: 1em;
        left: 1em;
    }
    @media (max-width: 600px) {
        .back {
            position: static;
            margin-left: 1em;
            margin-top: 1em;
        }
    }
</style>
<a href="/countdown" class="btn variant-ringed-surface back">
    <ArrowLeftCircle/> &nbsp;
    Back to countdown
</a>
<div class="container mx-auto">
    <br>
    <h1>Desktop app</h1>
    The redclock.fun desktop app is here and ready!<br>
    <br>
    Red Clock Desktop is a program that will show you the time no matter what you have open!<br>
    When you first open the installer (on windows), it will tell you it is unsafe. This is because I dont want to pay $80+ per year to get that message to go away. Click more info then Run Anyway.<br>
    <br>
    Once you have it installed, it will put a shortcut on your desktop and open it. The first time you open it, it will open your browser in order to retrieve your selected school and schedule.
    Once it is open, you will be able to move it around while it has the gray background.<br>

    Once you click away from it, the background will go completely clear and you can do whatever you were going to do.

    If you want to move it around, you can move it while the background is gray. To go into this state again, just click the countdown.
    <br><br>
    While you are in the moving state, you can make it bigger or smaller by pressing + and -. Press 0 to make it go back to the default size.<br>
    <br>
    <b>To close it</b>, just press escape (ESC) while the background is gray.<br>
    <br>
    If you ever need to change your school or schedule on the desktop app, change your school/schedule in your browser (in the settings tab), then press c in the desktop app.<br>
    <br>
    Join the discord server to tell me about any bugs you encounter!<br>
    <br>
    <br>
    Before downloading, please read the above info<br>
    <a data-sveltekit-reload href={getAPIPrefix(false) + "/api/desktop/download/win"} class="btn variant-ringed-surface card-hover">Windows Download</a>&nbsp
    <a data-sveltekit-reload href={getAPIPrefix(false) + "/api/desktop/download/linux"} class="btn variant-ringed-surface card-hover">Linux Download</a><br>
    <span style="font-size: 0.75em;">
        Last updated: <DateStamp date={new Date(data.lastUpdate)}/><br>
        Schedules are updated automatically. You only need to re-download if you are updating the desktop app itself.
    </span>
</div>