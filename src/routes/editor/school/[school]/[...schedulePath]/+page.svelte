<script>
    import ScheduleEditor from "$lib/editor/ScheduleEditor.svelte";
    import {SlideToggle} from "@skeletonlabs/skeleton";
    import {enhance} from "$app/forms";
    import {page} from "$app/stores";
    import {scheduleTypes} from "./scheduleTypes";
    import {capitalize, shortMonths, daysOfWeek} from "$lib/utils";

    export let data;
    export let form;

    let scheduleOut;
    $: scheduleOutString = JSON.stringify(scheduleOut);
    let scheduleOutFormattedString;

    $: scheduleOutFormattedString = JSON.stringify(scheduleOut, null, '\t');

    let scheduleOutFixed;

    let showOutput = false;
    let saving = false;

    let scheduleName;
    let scheduleDescription;
    let extraName;
    $: {
        const schedulePath = $page.params.schedulePath;
        const parts = schedulePath.split("/");
        let extra;
        if(parts.length > 1) extra = parts.pop().replaceAll("-", "/");
        scheduleName = parts.join("/");

        console.log({extra})

        if(extra) {
            extraName = extra.split(",").map((a => {
                if(scheduleName.includes("date")) {
                    const parts = a.split("/");
                    const month = parts[0];
                    const date = parts[1];

                    return shortMonths[month-1] + " " + date;
                } else if(scheduleName.includes("day")) {
                    return daysOfWeek[Number(a)];
                }
            })).join(", ");
        }

        scheduleDescription = scheduleTypes[scheduleName].description;
    }

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
<h1>{capitalize(scheduleName)} Schedules</h1>
{#if scheduleName.includes("specials")}
    <h2>{extraName}</h2>
{/if}
{scheduleDescription}<br>
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

<br>
<div class="card limit mx-auto p-2 mb-64">
    <ScheduleEditor schedule={data.schedule} schedules={data.schedules} bind:scheduleOut={scheduleOut}/>
</div>

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