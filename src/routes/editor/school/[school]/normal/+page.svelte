<script>
    import ScheduleEditor from "$lib/editor/ScheduleEditor.svelte";
    import {SlideToggle} from "@skeletonlabs/skeleton";

    export let data;

    let scheduleOut;
    let scheduleOutString;

    $: scheduleOutString = JSON.stringify(scheduleOut, null, '\t');

    let scheduleOutFixed;

    let showOutput = false;

    $: {
        if(typeof scheduleOutString === "string") {
            let removing = false;
            let chars = scheduleOutString.split("");
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

<SlideToggle size="sm" bind:checked={showOutput}>Show output</SlideToggle>

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