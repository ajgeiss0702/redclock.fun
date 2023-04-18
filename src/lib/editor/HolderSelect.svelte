<script lang="ts">
    export let school: EditorSchool = undefined;
    export let district: EditorDistrict = undefined;

    let type: string = school ? "school" : "district";

    let logo = school?.logo ?? district?.logo;

    if(logo.startsWith("https://redclock.fun")) {
        logo = logo.substring("https://redclock.fun".length)
    }
</script>
<a href="/editor/{type}/{school?.code ?? district?.code}" class="hidden-link school-container rounded-container-token border-token border-surface-200-700-token p-2 text-left mx-auto my-3 card-hover flex">
    <div class="flex-none self-center">
        <img src={logo} alt="{school?.code ?? district?.code}">
    </div>
    <div class="flex-1 self-center">
        <h2>{school?.display ?? district?.display}</h2>
        <span class="text-surface-400-500-token">
            {school?.code ?? district?.code}
            {#if school?.district}
                ({school.district})
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