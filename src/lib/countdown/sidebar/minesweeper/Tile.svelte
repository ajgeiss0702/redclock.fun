<script>
    export let bomb = false;
    export let clicked = false;

    let isMouseDown = false;

    function mouseDown() {
        isMouseDown = true;
    }
    function cancelMouseDown() {
        isMouseDown = false;
    }
</script>
<style>
    div {
        display: inline-block;
        background-color: #BFBFBF;
        height: 1em;
        width: 1em;
        margin: 0;
    }

    div:not(.bomb) {
        /*box-shadow: inset 0.1em 0.1em 0 0 white, inset -0.1em -0.1em 0 0 #7f7f7f7f;*/
        border-top: 0.1em solid white;
        border-left: 0.1em solid white;

        border-bottom: 0.1em solid #7f7f7f;
        border-right: 0.1em solid #7f7f7f;
    }

    div:not(.bomb).mousedown {
        background-color: #b0b0b0;
    }

    .bomb {
        background-image: url(/minesweeper/bomb.png);
        background-size: contain;
    }

    .bomb.clicked {
        background-color: red;
    }
</style>
<div
        class:bomb={bomb}
        class:clicked={clicked}
        class:mousedown={isMouseDown}
        on:click
        on:mousedown={mouseDown}
        on:mouseleave={cancelMouseDown}
></div>
