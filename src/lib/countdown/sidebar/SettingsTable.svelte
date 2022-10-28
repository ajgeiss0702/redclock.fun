<script>
    import '$lib/checkboxes.css'
    import {getSettings} from '$lib/settings';

    export let expand = false;
    export let bars = expand;
</script>
<style>
    table {
        text-align: center;
        width: 100%;
    }

    td.title {
        font-weight: bold;
    }
    td.desc {
        padding-left: 2em;
        padding-right: 2em;
    }
    .bars tr {
        border-bottom: 1px solid;
        border-top: 1px solid;
    }
    .slider-box {
        vertical-align: center;
    }
</style>
<table class:bars={bars}>
    {#each Object.keys(getSettings()) as settingKey (settingKey)}
        <tr data-toggle="tooltip" data-placement="top" title="{getSettings()[settingKey].description}">
            <td class="title">
                {getSettings()[settingKey].display}
            </td>
            {#if expand}
                <td class="desc">
                    {getSettings()[settingKey].description}
                </td>
            {/if}
            <td class="slider-box">
                <label class="tgl tgl-gray">
                    <input type="checkbox" checked={getSettings()[settingKey].content} data-setting={settingKey} onchange="setFromCheckbox(this)">
                    <span data-on="On" data-off="Off"></span>
                </label>
            </td>
        </tr>
    {/each}
</table>