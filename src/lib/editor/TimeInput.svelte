<script lang="ts">

    import {twoDigits} from "$lib/utils"
    export let time: number[] | null | undefined;

    let days = time === null || time === undefined ? 0 : time[0]

    let inValue = time === null || time === undefined ? undefined : twoDigits(time[1]) + ":" + twoDigits(time[2]) + ":" + twoDigits(time[3]);

    $: updateTime(days, inValue);

    function updateTime(days: number, inValue: string) {
        let parts = inValue == undefined ? ["NaN"] : inValue.split(":");
        if(parts.includes("NaN") || parts.includes("undefined") || parts.length < 3) {
            time = null;
            return;
        }
        time = [
            days ?? 0,
            Number(parts[0]),
            Number(parts[1]),
            Number(parts[2])
        ];
    }
</script>
<style>
    input {
        background-color: transparent;
        display: inline;
    }
    input[type=number] {
        width: 2.5em;
    }
    input[type=time] {
        width: 8em;
    }
</style>
<input type="number" bind:value={days} min="0" placeholder="0"/>
<input type="time" step="1" bind:value={inValue}/>
