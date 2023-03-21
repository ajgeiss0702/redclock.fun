<script lang="ts">
    export let school: EditorSchool;
</script>
<a href="/editor/school/{school.code}" class="hidden-link">
    <div class="school-container rounded-container-token border-token border-surface-200-700-token p-2 text-left mx-auto card-hover flex">
        <div class="flex-none self-center">
            <img src={school.logo} alt="{school.code}">
        </div>
        <div class="flex-1 self-center">
            <h2>{school.display}</h2>
            <span class="text-surface-400-500-token">
                {school.code}
            </span>
        </div>
    </div>
</a>

<style>
    .school-container {
        max-width: min(500px, calc(100vw - 1em));
    }

    img {
        height: 6em;
        min-width: 6em;
    }
</style>