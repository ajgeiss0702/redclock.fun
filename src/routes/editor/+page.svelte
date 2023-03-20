<script lang="ts">
    import SchoolSelect from "$lib/editor/SchoolSelect.svelte";

    export let data;
</script>

<svelte:head>
    <title>Red Clock Editor</title>
</svelte:head>

{#if data.user}
    Logged in as {data.user.name}
    <br>
    <br>
    {#each data.schools as school}
        <SchoolSelect {school}/>
    {:else}
        You don't have access to any schools.
    {/each}
{:else}
    Not logged in.<br>
    <br>
    <a href="/editor/auth/signin" class="btn variant-glass-primary">Sign in</a>
{/if}