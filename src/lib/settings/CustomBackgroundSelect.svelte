<script>
    import '$lib/css/checkboxes.css'
    import {Button} from "sveltestrap";
    import {browser} from "$app/environment";
    import {getBase64} from "$lib/utils.js";

    export let preview = false;
    export let customBackgroundComponent;

    let selectBox;

    let showBackgroundRemoveButton = browser && typeof localStorage.customBackground !== "undefined";


    async function fileSelect() {
        let file = selectBox.files[0];
        localStorage.customBackground = await getBase64(file);
        customBackgroundComponent.updateCustomBackground();
        showBackgroundRemoveButton = true;
    }

    function removeBackground() {
        localStorage.removeItem("customBackground")
        customBackgroundComponent.updateCustomBackground();
        showBackgroundRemoveButton = false;
        selectBox.value = "";
    }

    function toggleFillScreen() {
        localStorage.customBackgroundFill = !(localStorage.customBackgroundFill === "true");
        customBackgroundComponent.updateCustomBackground();
    }
</script>
<style>
    table {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }

    @media (min-width: 500px) {
        table {
            max-width: 500px;
        }
    }
    .left {
        display: inline-block;
        text-align: left;
    }

    input {
        margin-bottom: 0.5em;
    }
</style>
<div>
    <table>
        <tr>
            <td>
                Preview custom background on this page
            </td>
            <td>
                <label class="tgl tgl-gray">
                    <input type="checkbox" on:change={() => {preview = !preview}}>
                    <span data-on="On" data-off="Off"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td>Fill Screen</td>
            <td>
                <label class="tgl tgl-gray">
                    <input type="checkbox" checked={browser && localStorage.customBackgroundFill === "true"} on:change={toggleFillScreen}>
                    <span data-on="On" data-off="Off"></span>
                </label>
            </td>
        </tr>
    </table>
    <div class="left">
        <input type="file" accept="image/*" bind:this={selectBox} on:change={fileSelect}>
        <br>
        {#if showBackgroundRemoveButton}
            <Button outline color="danger" on:click={removeBackground}>Remove background</Button>
        {/if}
    </div>
</div>