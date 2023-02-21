<script lang="ts">
    import Tile from "$lib/countdown/sidebar/minesweeper/Tile.svelte";
    type Location = {
        x: number,
        y: number,
        clicked?: boolean
    }

    let clicked = false;

    let bombs: Location[] = [];

    function clickOne(clickedLocation: Location) {
        bombs = [];
        if(clicked) {
            clicked = false;
            return;
        }
        clickedLocation.clicked = true;
        bombs.push(clickedLocation);
        for (let i = 0; i < 9; i++) {
            let bomb: Location;

            while(!bomb || checkFor(bomb)) {
                bomb = {
                    x: Math.floor(9 * Math.random()),
                    y: Math.floor(9 * Math.random())
                };
            }

            bombs.push(bomb);
        }
        clicked = true;
    }

    function checkFor(bomb: Location) {
        for (const b of bombs) {
            if(b.x == bomb.x && b.y == bomb.y) return true;
        }
        return false;
    }

    function isClicked(bomb: Location) {
        for (const b of bombs) {
            if(b.x == bomb.x && b.y == bomb.y) return b.clicked;
        }
        return false;
    }

    $: console.log(bombs);
</script>
<style>
    div {
        line-height: 0;
        display: inline-grid;
        /*box-shadow: 0.1em 0.1em 0 0 white, -0.1em -0.1em 0 0 #7f7f7f;*/

        border-top: 0.1em solid #7f7f7f;
        border-left: 0.1em solid #7f7f7f;

        border-bottom: 0.1em solid white;
        border-right: 0.1em solid white;

        grid-template-columns: repeat(9, minmax(0, 1fr));
    }
</style>
<div>
    {#key clicked}
        {#each [...Array(9).keys()] as x}
            {#each [...Array(9).keys()] as y}
                <Tile on:click={() => clickOne({x: x, y: y})} bomb={checkFor({x: x, y: y})} clicked={isClicked({x: x, y: y})}/>
            {/each}
        {/each}
    {/key}
</div>