<script lang="ts">
    import {ScheduleTimes} from "../countdown/countdown-utils";
    import {Accordion, AccordionItem} from "@skeletonlabs/skeleton";
    import {makeDate} from "$lib/countdown/countdown-utils.ts";
    import {dateString} from "$lib/utils";

    export let schedule: ScheduleTimes;
    export let schedules: {[key: string]: string} = {};

    $: console.log({schedule})
</script>
<style>
    .schedulesContainer {
        max-width: 800px;
    }
    input {
        background-color: transparent;
    }
</style>

<!-- TODO: https://svelte.dev/repl/3bf15c868aa94743b5f1487369378cf3?version=3.21.0 -->

<div class="schedulesContainer m-2 mx-auto">
    <Accordion>
        {#each Object.entries(schedule) as [scheduleCode, schedule]}
            <AccordionItem open>
                <svelte:fragment slot="summary">{schedules[scheduleCode] || scheduleCode}</svelte:fragment>
                <svelte:fragment slot="content">
                    <table class="mx-auto">
                        {#each Object.entries(schedule) as [entryName, time]}
                            <tr>
                                <td class="px-4"><input type="text" bind:value={entryName}></td>
                                <td class="px-4">{dateString(makeDate(time))}</td>
                            </tr>
                        {/each}
                    </table>
                </svelte:fragment>
            </AccordionItem>
        {:else}
            Hm, something is missing here..
        {/each}
    </Accordion>
</div>