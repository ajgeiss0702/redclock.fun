<script lang="ts">
    import HolderSelect from "$lib/editor/HolderSelect.svelte";

    export let data;
</script>

<svelte:head>
    <title>Red Clock Editor</title>
</svelte:head>

{#if data.user}
    Logged in as {data.user.name}
    <br>
    <br>
    <h1>Schools</h1>
    {#each data.schools as school}
        <HolderSelect {school}/>
    {:else}
        You don't have access to any schools.
    {/each}
    <br>
    <br>
    {#if data.districts && data.districts.length > 0}
        <h1>Districts</h1>
        {#each data.districts as district}
            <HolderSelect {district}/>
        {/each}
    {/if}
{:else}
    Not logged in.<br>
    <br>
    <a href="/editor/auth/signin" class="btn variant-glass-primary">Sign in</a>
{/if}