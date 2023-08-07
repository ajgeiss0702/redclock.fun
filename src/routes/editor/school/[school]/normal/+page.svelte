<script>
    import ScheduleEditor from "$lib/editor/ScheduleEditor.svelte";
    import {SlideToggle} from "@skeletonlabs/skeleton";
    import {enhance} from "$app/forms";

    export let data;
    export let form;

    let scheduleOut;
    $: scheduleOutString = JSON.stringify(scheduleOut);
    let scheduleOutFormattedString;

    $: scheduleOutFormattedString = JSON.stringify(scheduleOut, null, '\t');

    let scheduleOutFixed;

    let showOutput = false;
    let saving = false;

    $: isSame = scheduleOut ? (Object.keys(scheduleOut).length === 0 ? true : JSON.stringify(data.schedule) === JSON.stringify(scheduleOut)) : true;

    $: {
        if(typeof scheduleOutFormattedString === "string") {
            let removing = false;
            let chars = scheduleOutFormattedString.split("");
            let remove = [];
            for (let i = 0; i < chars.length; i++) {
                let char = chars[i]
                if(removing) {
                    if(char === "]") {
                        removing = false;
                    } else if(char === "\t" || char === "\n") {
                        remove.push(i);
                    }
                } else {
                    if(char === "[") {
                        removing = true
                    }
                }
            }

            for (let i = chars.length-1; i >= 0; i--) {
                if(!remove.includes(i)) continue;

                if(chars[i] === "\n" && chars[i-1] === ",") {
                    chars[i-1] = ", "
                }

                chars.splice(i, 1);
            }

            scheduleOutFixed = chars.join("");
        }
    }
</script>
<h1>Normal Schedules</h1>
The "normal" schedule is the schedule that Red Clock will follow if there are no "special" schedules to follow.<br>
<br>
<svelte:window on:beforeunload={(event) => {
    if(isSame) return;
    event.preventDefault();
    const message = "You are still editing schedules! Are you sure you want to exit?";
    event.returnValue = message;
    return message;
}}/>

<SlideToggle size="sm" bind:checked={showOutput}>Show output</SlideToggle>

<form method="POST" use:enhance={() => {
            saving = true;
            return async ({ update }) => {
                await update({ reset: false });
                saving = false;
            };
          }}>
    <button class="btn btn-sm variant-ghost-success" disabled={isSame}>Save Changes</button>
    {#if saving}
        <div class="inline-block absolute right-0 mt-2 pl-16">
            <img class="inline-block relative" style="height: 2em; left: 2.5em" src="/img/loading.svg" alt="Saving">
        </div>
    {/if}
    <input class="hidden" name="new-schedule" bind:value={scheduleOutString}/>
    {#if form?.message}
        <br>
        <span style="color: red">
            {form.message}
        </span>
    {/if}
</form>

<ScheduleEditor schedule={data.schedule} schedules={data.schedules} bind:scheduleOut={scheduleOut}/>

<div class="preview" class:hidden={!showOutput}>
    <pre class="text-left inline-block">{scheduleOutFixed}</pre>
</div>
<style>

    @media (min-width: 1300px) {
        .preview {
            position: fixed;
            right: 0;
            top: 4rem;
            max-height: calc(100vh - 4rem);
            overflow: auto;
            width: auto;
        }
    }
</style>