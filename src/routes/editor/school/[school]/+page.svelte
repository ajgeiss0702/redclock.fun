<script>
    import {enhance} from "$app/forms";

    export let data;
    export let form;

    let originalOffset = data.school.offset;
    let offset = data.school.offset;
</script>

<svelte:head>
    <title>{data.school.display.length < 10 ? data.school.display : data.school.code.toUpperCase()} Schedules - Red Clock</title>
</svelte:head>
<br>

<form class="limit mx-auto" method="POST" action="?/offset" use:enhance={() => {
            return async ({ update }) => {
                await update({ reset: false });
                originalOffset = offset;
            };
          }}
>
    Offset
    <input class="input px-3" type="number" name="offset" bind:value={offset}/>
    <button class="btn btn-sm variant-ghost-success" disabled={originalOffset === offset}>Save</button>
    {#if form?.message}
        <span style="color: red;">
            {form.message}
        </span>
    {/if}
</form>
<br>

<a class="btn variant-glass-primary" href="{data.school.code}/normal">Normal Schedules</a>
<br>
<br>
<a class="btn variant-glass-primary" href="{data.school.code}/special">Special Schedules</a>
<br>
<br>
<a class="btn variant-glass-primary" href="{data.school.code}/breaks">Breaks</a>

<style>
    input[name=offset] {
        width: 5em;
    }
    .limit {
        width: calc(min(90vw, 56em))
    }
    button {
        margin-top: 0.5em;
    }
</style>


