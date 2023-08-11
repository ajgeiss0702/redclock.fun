<script>
    import {page} from "$app/stores";

    export let user;
</script>

{#if user}
    <a href="/editor/user">Logged in as {user.name}</a>
    &nbsp;
    <a href="/editor/auth/signout" class="btn variant-glass-primary">Sign out</a>
{:else}
    <a href="/editor/auth/signin?to={$page.url.pathname}" class="btn variant-glass-primary">Sign in</a>
{/if}