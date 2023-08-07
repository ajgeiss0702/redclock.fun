<script>
    import {enhance} from "$app/forms";

    export let data;
    export let form;

    let originalOffset = data.school?.offset;
    let offset = data.school?.offset;

    let offsetSaving = false;
</script>

<svelte:head>
    <title>{(data.school?.display ?? "").length < 10 ? data.school?.display : data.school?.code.toUpperCase()} Schedules - Red Clock</title>
</svelte:head>
<br>

<form class="inline-block relative" method="POST" action="?/offset" use:enhance={() => {
            offsetSaving = true;
            return async ({ update }) => {
                await update({ reset: false });
                offsetSaving = false;
                originalOffset = offset;
            };
          }}
>
    Offset
    <input class="input px-3" type="number" name="offset" bind:value={offset}/>
    <button class="btn btn-sm variant-ghost-success" disabled={originalOffset === offset}>Save</button>
    {#if offsetSaving}
        <div class="inline-block absolute right-0 mt-2 pl-16">
            <img class="inline-block relative" style="height: 2em; left: 2.5em" src="/img/loading.svg" alt="Saving">
        </div>
    {/if}
    {#if form?.message}
        <span style="color: red;">
            {form.message}
        </span>
    {/if}
</form>
<br>
<br>

<a class="btn variant-glass-primary" href="{data.school?.code}/normal">Normal Schedules</a>
<br>
<br>
<a class="btn variant-glass-primary" href="{data.school?.code}/special">Special Schedules</a>
<br>
<br>
<a class="btn variant-glass-primary" href="{data.school?.code}/breaks">Breaks</a>

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


