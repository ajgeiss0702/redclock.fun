<svelte:head>
    <title>Settings - Red Clock</title>
</svelte:head>
<script>
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
        padding-left: 0.5em;
        padding-right: 0.5em;
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
            text-align: center;
        }
        .nav-link {
            margin-left: auto;
            margin-right: auto;
            display: inline-block;
        }
    }

    .settings-nav > .selected {
        color: inherit !important;
    }

    a:link {
        text-decoration: none !important;
        padding: 8px 16px 8px 16px;
    }

    .settings-nav {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;

        text-align: left;

        flex-direction: column !important;
    }

    .selected {
        color: inherit;
    }
</style>
<div class="s-container">
    <div class="s-nav">
        <div class="settings-nav">
            <a class="btn variant-ringed-surface" href="/countdown">Back to countdown</a>
            <a class="nav-link selectable" href="/settings" class:selected={$page.url.pathname === "/settings"}>Basic Settings</a>
            <a class="nav-link selectable" href="/settings/theme" class:selected={$page.url.pathname === "/settings/theme"}>Theme Settings</a>
            <a class="nav-link selectable" href="/settings/layout" class:selected={$page.url.pathname === "/settings/layout"}>Layout Settings</a>
        </div>
    </div>
    <div class="slot">
        <br>
        <slot/>
    </div>
</div>