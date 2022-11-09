<script>
    import {Button} from "sveltestrap";
    import SettingsTable from "$lib/countdown/sidebar/SettingsTable.svelte";
</script>
<style>
    div {
        text-align: center;
    }
</style>
<div>
    <h1>Settings</h1>
    <small>The 🔋 icon means that setting will save battery if disabled.<br></small>
    <br>
    <SettingsTable/>
    <br>
    <Button color="primary" href="/settings">More settings</Button><br>
    <br>
    <Button color="secondary" on:click={() => location.href = "/schools"}>Select a different school or schedule</Button>
</div>