<script lang="ts">
    import {ScheduleTimes} from "../countdown/countdown-utils";
    import {Accordion, AccordionItem} from "@skeletonlabs/skeleton";
    import TimeInput from "./TimeInput.svelte";

    export let schedule: ScheduleTimes;
    export let schedules: {[key: string]: string} = {};

    let loopableSchedule = (() => {
        let list = [];
        for (let scheduleCode in schedule) {
            let scheduleOrigData = schedule[scheduleCode];
            let scheduleData = [];
            for (const className in scheduleOrigData) {
                let classTimes = scheduleOrigData[className];
                scheduleData.push({
                    name: className,
                    times: classTimes
                });
            }
            list.push({
                code: scheduleCode,
                schedule: scheduleData
            });
        }
        return list;
    })()

    export let scheduleOut = {};
    
    $: scheduleOut = (() => {
        let o = {};
        for (const {code, schedule} of loopableSchedule) {
            let times = {};
            for (let c of schedule) {
                times[c.name] = c.times;
            }
            o[code] = times;
        }
        console.log({scheduleOut: o})
        return o;
    })();

    $: console.log({loopableSchedule})
</script>
<style>
    .schedulesContainer {
        max-width: 800px;
    }
    input {
        background-color: transparent;
    }
    td {
        border-bottom: 1px solid rgba(0, 0, 0, 0.56);
        border-top: 1px solid rgba(0, 0, 0, 0.56);
    }
    :global(.dark) td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.56);
        border-top: 1px solid rgba(255, 255, 255, 0.56);
    }
</style>

<!-- TODO: https://svelte.dev/repl/3bf15c868aa94743b5f1487369378cf3?version=3.21.0 -->

<div class="schedulesContainer m-2 mx-auto">
    <Accordion>
        {#each loopableSchedule as {code, schedule}}
            <AccordionItem>
                <svelte:fragment slot="summary">{schedules[code] ?? code}</svelte:fragment>
                <svelte:fragment slot="content">
                    <table class="mx-auto">
                        {#each schedule as {name, times}}
                            <tr>
                                <td class="px-4 py-2"><input type="text" bind:value={name}></td>
                                <td class="px-4 py-2">
                                    <TimeInput bind:time={times}/>
                                </td>
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