<script lang="ts">

    import {twoDigits} from "$lib/utils"
    export let time: number[];

    let days = time[0]

    let inValue = twoDigits(time[1]) + ":" + twoDigits(time[2]) + ":" + twoDigits(time[3]);

    $: updateTime(days, inValue);

    function updateTime(days: number, inValue: string) {
        let parts = inValue.split(":");
        time = [
            days,
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
<input type="number" bind:value={days} min="0"/>
<input type="time" step="1" bind:value={inValue}/>
