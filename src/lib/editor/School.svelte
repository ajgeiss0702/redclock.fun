<script lang="ts">
    export let school;
</script>

<div class="flex justify-items-center">
    <div class="inline-block pb-2 text-left mx-auto flex">
        <div class="flex-none self-center">
            <img src={school.logo} style="max-height: 6em;" alt="{school.code}">
        </div>
        <div class="flex-1 self-center">
            <h2>{school.display}</h2>
            <span class="text-surface-400-500-token">
                {school.code}
                {#if school.district}
                    ({school.district})
                {/if}
            </span>
        </div>
    </div>
</div>