<script>
    import {onMount} from "svelte";
    import {invalidate} from "$app/navigation";

    onMount(() => {
        let i = setInterval(() => invalidate("https://schedules.redclock.fun/test"), 1e3);
        return () => clearInterval(i);
    })
    export let data;
</script>

{data.value}