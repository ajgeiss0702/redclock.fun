<script>
    import {page} from "$app/stores";

    export let data;
</script>

<svelte:head>
    <title>{$page.params.school.toUpperCase()} Schedules - Red Clock</title>
</svelte:head>

param: {$page.params.school}<br>
school code from db: {data.school.code}<br>
<br>
{data.school.display}