<script>

    import '$lib/checkboxes.css'
    import {browser} from "$app/environment";

    let followSystem = true;
    if(browser) {
        followSystem = localStorage.getItem("followSystemTheme") == null ? true : localStorage.getItem("followSystemTheme") === "true";
    }

    let theme = "light";
    if(browser) {
        theme = getCookie("theme") || "light";
    }

    let initialTheme = theme;

    let themeSelectBox;

    let initialFollowSystem = followSystem;

    function toggleFollowSystem() {
        followSystem = !followSystem;
        localStorage.setItem("followSystemTheme", String(followSystem));
        updateTheme();
    }

    function changeTheme() {
        setCookie("theme", themeSelectBox.value);
        updateTheme();
    }
</script>
<style>
    table {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }

    .hidden {
        display: none !important;
    }

    .table-container {
        padding: 1em;
    }

    .theme-select-box {
        width: 7em;
    }

    .title {
        width: 10em;
    }

    .invisible-text {
        color: rgba(0, 0, 0, 0);
    }

    @media (min-width: 500px) {
        table {
            max-width: 500px;
        }
    }
</style>
<h1>Theme Settings</h1>

<div class="table-container">
    <table>
        <tr>
            <td class="title">Follow System Theme</td>
            <td class="spacer"></td>
            <td>
                <label class="tgl tgl-gray">
                    <input type="checkbox" checked={initialFollowSystem}  on:change={toggleFollowSystem}>
                    <span data-on="On" data-off="Off"></span>
                </label>
            </td>
        </tr>
        <tr class:invisible-text={followSystem}>
            <td class="title">Theme</td>
            <td class="spacer"></td>
            <td class="theme-select-box">
                <select class="form-select d-inline-block mw-100" class:hidden={followSystem} on:change={changeTheme} bind:this={themeSelectBox}>
                    <option selected={initialTheme === "light"} value="light">Light</option>
                    <option selected={initialTheme === "dark"} value="dark">Dark</option>
                    <option selected={initialTheme === "black"} value="black">Black</option>
                </select>
            </td>
        </tr>
    </table>
</div>