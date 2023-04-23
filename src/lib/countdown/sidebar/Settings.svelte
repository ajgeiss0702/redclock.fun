<script>
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
    <a class="btn variant-glass-primary" href="/settings">More settings</a><br>
    <br>
    <a class="btn variant-outline-primary" href="/schools">Select a different school or schedule</a>
</div>