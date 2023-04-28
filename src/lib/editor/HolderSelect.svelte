<script lang="ts">
    export let school: KVListResponse.keys = undefined;
    export let district: KVListResponse.keys = undefined;

    let type: string = school ? "school" : "district";

    let logo = school?.metadata?.logo ?? district?.metadata?.logo;

    if(logo.startsWith("https://redclock.fun")) {
        logo = logo.substring("https://redclock.fun".length)
    }
</script>
<a href="/editor/{type}/{school?.name ?? district?.name}" class="hidden-link school-container rounded-container-token border-token border-surface-200-700-token p-2 text-left mx-auto my-3 card-hover flex">
    <div class="flex-none self-center">
        <img src={logo} alt="{school?.name ?? district?.name}">
    </div>
    <div class="flex-1 self-center">
        <h2>{school?.metadata?.display ?? district?.metadata?.display}</h2>
        <span class="text-surface-400-500-token">
            {school?.name ?? district?.name}
            {#if school?.metadata?.district}
                ({school.metadata?.district})
            {/if}
        </span>
    </div>
</a>

<style>
    .school-container {
        max-width: min(500px, calc(100vw - 1em));
    }

    img {
        height: 6em;
        width: 6em;
        object-fit: contain;
        margin-right: 0.5em;
    }
</style>