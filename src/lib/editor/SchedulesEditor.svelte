<script>

    import {flip} from "svelte/animate";
    import {fly} from "svelte/transition";

    export let schedules;
    export let schedulesOut = {};
    export let form = false;

    $: schedulesJson = JSON.stringify(schedulesOut);

    let loopableSchedules = Object.entries(schedules);

    $: schedulesOut = (() => {
        let o = {};
        for (let [scheduleCode, scheduleDisplay] of loopableSchedules) {
            o[scheduleCode] = scheduleDisplay;
        }
        return o;
    })();


    let newCode = "";
    let newDisplay = "";

    function addNew() {
        loopableSchedules.push([newCode, newDisplay]);
        loopableSchedules = loopableSchedules;
        newCode = "";
        newDisplay = ""
    }

    function checkNewEnter(e) {
        if(e.key !== "Enter") return;
        e.preventDefault();
        addNew();
    }
</script>
{#if form}
    <input class="hidden" name="schedules" bind:value={schedulesJson}>
{/if}

<table class="mx-auto table table-hover">
    <thead>
        <tr>
            <td>Schedule Code</td>
            <td>Schedule Display Name</td>
            <td></td>
        </tr>
    </thead>
    <tbody>
        {#each loopableSchedules as [scheduleCode, scheduleDisplay], i (scheduleCode)}
            <tr animate:flip={{duration: 100}} in:fly|local={{duration: 100, y: 100}}>
                <td><input type="text" bind:value={scheduleCode}></td>
                <td><input type="text" bind:value={scheduleDisplay}></td>
                <td>
                    <button
                            on:click|preventDefault={() => {
                                loopableSchedules.splice(i, 1);
                                loopableSchedules = loopableSchedules;
                            }}
                            class="btn btn-sm variant-ghost-error"
                    >
                        Remove
                    </button>
                </td>
            </tr>
        {/each}
        <tr>
            <td>
                <input type="text" bind:value={newCode} placeholder="New Code" on:keydown={checkNewEnter}>
            </td>
            <td>
                <input type="text" bind:value={newDisplay} placeholder="New Display" on:keydown={checkNewEnter}>
            </td>
            <td>
                <button on:click|preventDefault={addNew} class="btn btn-sm variant-ghost-success">Add</button>
            </td>
        </tr>
    </tbody>
</table>

<style>
    td {
        @apply text-left px-2;
        vertical-align: middle;
    }
    td:nth-child(1) {
        @apply text-right;
    }
    td:nth-child(1) > input {
        @apply text-right;
    }

    input {
        background-color: transparent;
    }
</style>
