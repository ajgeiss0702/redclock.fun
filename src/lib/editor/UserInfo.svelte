<script>
    import {page} from "$app/stores";

    export let user;
</script>

{#if user}
    Logged in as {user.name}
    <a href="/editor/auth/signout" class="btn variant-glass-primary">Sign out</a>
{:else}
    <a href="/editor/auth/signin?to={$page.url.pathname}" class="btn variant-glass-primary">Sign in</a>
{/if}