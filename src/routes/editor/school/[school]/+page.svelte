<script>
    import {page} from "$app/stores";

    export let data;
</script>

<svelte:head>
    <title>{data.school.display.length < 10 ? data.school.display : data.school.code.toUpperCase()} Schedules - Red Clock</title>
</svelte:head>
<br>

<a class="btn variant-glass-primary" href="{data.school.code}/normal">Normal Schedules</a>
<br>
<br>
<a class="btn variant-glass-primary" href="{data.school.code}/special">Special Schedules</a>
<br>
<br>
<a class="btn variant-glass-primary" href="{data.school.code}/breaks">Breaks</a>


