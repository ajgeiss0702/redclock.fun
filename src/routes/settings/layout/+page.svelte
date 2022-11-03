<script>
    import Layout from "$lib/settings/Layout.svelte";
    import {browser} from "$app/environment";
    import "$lib/css/checkboxes.css"

    let activeLayout = (browser && getCookie("layout")) || "default";
    let useIframes = false;

    function changeLayout(newLayout) {
        setLayout(newLayout);
        activeLayout = newLayout
    }

    export let layouts = ["default", "mirrored", "large", "countdown"]
</script>
<style>
    table {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }
</style>
<h1>Countdown Layouts</h1>
<table>
    <tr>
        <td>Preview on real page: &nbsp; </td>
        <td>
            <label class="tgl tgl-gray">
                <input type="checkbox" on:change={() => useIframes = !useIframes}/>
                <span data-on="On" data-off="Off"></span>
            </label>
        </td>
        <td>&nbsp; (really laggy)</td>
    </tr>
</table>
<br>
{#each layouts as layout}
    <Layout {layout} {activeLayout} useIframe={useIframes} on:click={() => changeLayout(layout)}/>
{/each}