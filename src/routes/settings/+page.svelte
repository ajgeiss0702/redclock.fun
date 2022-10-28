<script>
    import {Alert, Button} from "sveltestrap";
    import SettingsTable from "$lib/countdown/sidebar/SettingsTable.svelte";
    import {browser} from "$app/environment";
</script>
<style>
    div {
        text-align: center;
    }

    .settings-table {
        margin-left: auto;
        margin-right: auto;
    }

    @media (min-width: 1000px) {
        .settings-table {
            max-width: 1000px;
        }
    }

    .menu-loc:after {
        content: "at the top";
    }

    @media (min-width: 900px) {
        .menu-loc:after {
            content: "to the left";
        }
    }
</style>
<div>
    <Alert class="d-inline-block" color="warning" dismissible>
        <h1>Settings page WIP</h1>
        Other than themes and layouts (and the settings that are in the settings tab), im not sure what settings I should have here.<br>
        <br>
        If you have ideas for more settings there should be, let me know using any of the contact methods mentioned in the news about this (in the news tab on the main page)
    </Alert>
    <h1>Basic Settings</h1>
    These settings are the same settings shows in the settings tab on the countdown page.<br>
    To see more settings, select a category using the list <span class="menu-loc"></span><br>
    <!--{#if browser && window.matchMedia('(min-width: 900px)').matches}
        to the left
    {:else}
        at the top
    {/if}-->
    <br>
    <div class="settings-table">
        <SettingsTable expand={true}/>
    </div>
</div>