<svelte:head>
    <title>Settings - Red Clock</title>
</svelte:head>
<script>
    import {Button, Nav, NavLink} from "sveltestrap";
    import {page} from "$app/stores";
</script>
<style>
    .slot {
        width: 100%;
        text-align: center;
        padding-bottom: 20em;
    }
    .s-nav {
        min-width: 12em;
    }

    @media (min-width: 900px) {
        .s-container {
            display: flex;
            width: 100vw;
            height: 100vh;
        }
        .s-nav {
            border-right: 1px solid;
        }
    }
    @media (max-width: 900px) {
        .s-nav {
            border-bottom: 1px solid;
        }
    }

    :global(.settings-nav > .active) {
        color: inherit;
    }

    .selected {
        color: inherit;
    }
</style>
<div class="s-container">
    <div class="s-nav">
        <Nav class="settings-nav" vertical>
            <Button outline color="secondary" href="/countdown">Back to countdown</Button>
            <a class="nav-link selectable" href="/settings" class:selected={$page.url.pathname === "/settings"}>Basic Settings</a>
            <a class="nav-link selectable" href="/settings/theme" class:selected={$page.url.pathname === "/settings/theme"}>Theme Settings</a>
            <a class="nav-link selectable" href="/settings/layout" class:selected={$page.url.pathname === "/settings/layout"}>Layout Settings</a>
        </Nav>
    </div>
    <div class="slot">
        <br>
        <slot/>
    </div>
</div>