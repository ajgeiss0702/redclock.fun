<script>

import Tiles from "$lib/countdown/sidebar/minesweeper/Tiles.svelte";
import Top from "$lib/countdown/sidebar/minesweeper/Top.svelte";
</script>
<style>
    div {
        display: inline-block;
        color: black;
    }
    div.outer {
        font-size: 2.5em;
        line-height: 0;

        border-top: 0.1em solid white;
        border-left: 0.1em solid white;

        border-bottom: 0.1em solid #7f7f7f;
        border-right: 0.1em solid #7f7f7f;
    }

    div.inner {
        border: 0.2em solid #bfbfbf;
    }
    div.top {
        width: 100%;
        border-top: 0.2em solid #bfbfbf;
        border-left: 0.2em solid #bfbfbf;
        border-right: 0.2em solid #bfbfbf;
    }


</style>
<div class="outer">
    <div class="top">
        <Top/>
    </div>
    <br>
    <div class="inner">
        <Tiles/>
    </div>
</div>