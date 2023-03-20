<script lang="ts">
    export let data;
</script>

{#if data.user}
    Logged in as {data.user.name}
{:else}
    Not logged in.<br>
    <br>
    <a href="/editor/auth/signin" class="btn variant-glass-primary">Sign in</a>
{/if}