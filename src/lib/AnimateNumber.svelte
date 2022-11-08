<script>
    import {commas} from "$lib/utils.js";
    import {onDestroy} from "svelte";

    export let number;
    export let duration = 1;

    let durationMills = 1e3;

    let current = 0;
    let last = 0;

    let frame = 0;

    $: durationMills = duration * 1e3;
    $: updateNumber(number);

    onDestroy(() => {
        clearInterval(animationInterval);
    })

    function updateNumber(number) {
        last = Number(current);
        current = Number(number);
        if(isNaN(last)) last = 0;
        frame = last;
        startAnimation();
    }

    let start;
    let end;
    let animationInterval;
    function startAnimation() {
        clearInterval(animationInterval);
        console.log("start")
        start = Date.now();
        end = Date.now() + durationMills;
        animationInterval = setInterval(() => {
            let t = (Date.now() - start) / durationMills;
            let p = (3 * ((1 - t) * Math.pow(t, 2))) + Math.pow(t, 3);
            if(t > 1 || p > 1) {
                clearInterval(animationInterval);
                frame = current;
                return;
            }
            setCurrent(t, p);
        }, 17)
    }

    function setCurrent(t, p) {
        frame = Math.round(last + ((current - last) * p));
    }
</script>
{#if !isNaN(Number(number))}
    {commas(frame)}
{/if}