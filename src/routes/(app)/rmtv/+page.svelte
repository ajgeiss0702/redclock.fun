<script>

import CountdownBox from "$lib/countdown/CountdownBox.svelte";
</script>
<style>
    div {
        text-align: center;
    }
    .banner {
        font-size: 10vh;
        display: inline-block;
        width: 99vw;
        text-align: center;
        line-height: 1em;
        padding-top: 0;
        margin: 0 0 2rem;
        font-weight: bold;
    }

    div {
        background-color: rgb(140, 0, 0) !important;
    }
</style>
<div class="h-screen">
    <span class="banner">www.redclock.fun</span>
    <br>
    <CountdownBox box={false}/>
</div>