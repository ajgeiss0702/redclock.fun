<script>
    import {settings} from '$lib/settings';
    import '$lib/checkboxes.css'
    import {Button} from "sveltestrap";
</script>
<style>
    div {
        text-align: center;
    }

    table {
        text-align: center;
        width: 100%;
    }

    td.title {
        font-weight: bold;
    }
</style>
<div>
    <h1>Settings</h1>
    <small>The 🔋 icon means that setting will save battery if disabled.<br></small>
    <br>
    <table>
        {#each Object.keys(settings) as settingKey (settingKey)}
            <tr data-toggle="tooltip" data-placement="top" title="{settings[settingKey].description}">
                <td class="title">
                    {settings[settingKey].display}
                </td>
                <td>
                    <label class="tgl tgl-gray">
                        <input type="checkbox" checked={settings[settingKey].content} data-setting={settingKey} onchange="setFromCheckbox(this)">
                        <span data-on="On" data-off="Off"></span>
                    </label>
                </td>
            </tr>
        {/each}
    </table>
    <br>
    <Button color="secondary" href="/schools">Select a different school or schedule</Button>
</div>