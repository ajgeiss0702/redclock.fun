<script lang="ts">
    import type {ClassTimes, ScheduleTimes} from "../countdown/countdown-utils";
    import {Accordion, AccordionItem} from "@skeletonlabs/skeleton";
    import TimeInput from "./TimeInput.svelte";
    import VerticalArrows from "$lib/editor/VerticalArrows.svelte";
    import {send, receive} from "$lib/editor/transition"
    import { flip } from 'svelte/animate';
    import {dev} from "$app/environment";

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
    })();

    function move<Type>(list: Type[], currentIndex: number, newIndex: number) {
        const item = list[currentIndex];
        list.splice(currentIndex, 1);
        list.splice(newIndex, 0, item);
        console.log(item, list[newIndex])
        return list;
    }

    export let scheduleOut = {};
    
    $: scheduleOut = (() => {
        let o: ScheduleTimes = {};
        for (const {code, schedule} of loopableSchedule) {
            let times: ClassTimes = {};
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

<!-- TODO: https://svelte.dev/repl/3bf15c868aa94743b5f1487369378cf3?version=3.21.0 -->

<div class="schedulesContainer m-2 mx-auto">
    <Accordion>
        {#each loopableSchedule as {code, schedule}}
            <AccordionItem open={dev}>
                <svelte:fragment slot="summary">{schedules[code] ?? code}</svelte:fragment>
                <svelte:fragment slot="content">
                    <table class="mx-auto">
                        {#each schedule as {name, times}, i (name)}
                            <tr
                                    in:receive={{ key: name }}
                                    out:send={{ key: name }}
                                    animate:flip={{ duration: 150 }}
                            >
                                <td>
                                    <VerticalArrows
                                        on:up={() => {
                                            schedule = move(schedule, i, i-1);
                                        }}
                                        on:down={() => {
                                            schedule = move(schedule, i, i+1);
                                        }}
                                    />
                                </td>
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