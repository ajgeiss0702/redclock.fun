<script>
    import {page} from "$app/stores";

    export let data;
</script>

<svelte:head>
    <title>{data.school.display.length < 10 ? data.school.display : data.school.code.toUpperCase()} Schedules - Red Clock</title>
</svelte:head>

school yeah

