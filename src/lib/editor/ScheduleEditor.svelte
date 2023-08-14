<script lang="ts">
    import type {ClassTimes, ScheduleTimes} from "../countdown/countdown-utils";
    import {Accordion, AccordionItem} from "@skeletonlabs/skeleton";
    import TimeInput from "./TimeInput.svelte";
    import VerticalArrows from "$lib/editor/VerticalArrows.svelte";
    import { flip } from 'svelte/animate';
    import {fly} from "svelte/transition";
    import {dev} from "$app/environment";
    import TrashFill from "svelte-bootstrap-icons/lib/TrashFill.svelte";
    import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";


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
                    uid: crypto.randomUUID(),
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
        return o;
    })();

    function removeSchedule(index: number) {
        loopableSchedule.splice(index, 1);
        loopableSchedule = loopableSchedule;
    }

    let newClass = "";
    let newTime = null;

    let newTimeVersion = 0;

</script>

<!-- TODO: https://svelte.dev/repl/3bf15c868aa94743b5f1487369378cf3?version=3.21.0 -->

<div class="schedulesContainer m-2 mx-auto">
    <Accordion>
        {#each loopableSchedule as {code, schedule}, li}
            <AccordionItem open={dev}>
                <svelte:fragment slot="summary">{schedules[code] ?? code}</svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="text-right">
                        <button class="btn btn-sm variant-ghost-error" on:click={() => removeSchedule(li)}>Remove Schedule</button>
                    </div>
                    <table class="mx-auto">
                        {#each schedule as {name, times, uid}, i (uid)}
                            <tr
                                    animate:flip|local={{ duration: 150 }}
                                    in:fly|local={{duration: 100, y: 100}}
                            >
                                <td>
                                    <VerticalArrows
                                        on:up={() => {
                                            schedule = move(schedule, i, i-1);
                                        }}
                                        on:down={() => {
                                            schedule = move(schedule, i, i+1);
                                        }}
                                        allowUp={i !== 0}
                                        allowDown={i !== schedule.length - 1}
                                    />
                                </td>
                                <td class="px-4 py-2"><input type="text" bind:value={name}></td>
                                <td class="px-4 py-2">
                                    <TimeInput bind:time={times}/>
                                </td>
                                <td>
                                    <button class="btn btn-sm variant-ghost-error" on:click={() => {
                                        schedule.splice(i, 1);
                                        schedule = schedule;
                                    }}>
                                        <TrashFill/>
                                    </button>
                                </td>
                            </tr>
                        {/each}
                        <tr><td><span class="spacer">.</span></td></tr>
                        <tr>
                            <td></td>
                            <td>
                                <input type="text" bind:value={newClass} placeholder="New Class starts">
                            </td>
                            <td>
                                {#key newTimeVersion}
                                    <TimeInput bind:time={newTime}/>
                                {/key}
                            </td>
                            <td>
                                <button
                                        class="btn btn-sm variant-ghost-success"
                                        disabled={!newClass || !newTime || Object.keys(scheduleOut).includes(newClass)}
                                        on:click={() => {
                                            schedule.push({
                                                uid: crypto.randomUUID(),
                                                name: newClass,
                                                times: newTime
                                            });
                                            schedule = schedule;
                                            newClass = "";
                                            newTime = null;
                                            newTimeVersion++;
                                        }}
                                >
                                    <PlusCircleFill/>
                                </button>
                            </td>
                        </tr>
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

    .spacer {
        height: 1em;
        color: rgba(0, 0, 0, 0);
    }
</style>