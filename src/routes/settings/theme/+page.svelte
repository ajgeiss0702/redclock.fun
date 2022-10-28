<script>

    import '$lib/checkboxes.css'
    import {browser} from "$app/environment";

    let followSystem = true;
    if(browser) {
        followSystem = localStorage.getItem("followSystemTheme") == null ? true : localStorage.getItem("followSystemTheme") === "true";
    }

    let theme = "light";
    if(browser) {
        theme = getThemeName();
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

    .theme-select-box {
        width: 12em;
    }

    .invisible-text {
        color: rgba(0, 0, 0, 0);
    }

    @media (min-width: 1000px) {
        table {
            max-width: 1000px;
        }
    }
</style>
<h1>Theme Settings</h1>

<table>
    <tr>
        <td>Follow System Theme</td>
        <td>
            <label class="tgl tgl-gray">
                <input type="checkbox" checked={initialFollowSystem}  on:change={toggleFollowSystem}>
                <span data-on="On" data-off="Off"></span>
            </label>
        </td>
    </tr>
    <tr class:invisible-text={followSystem}>
        <td>Theme</td>
        <td class="theme-select-box">
            <select class="form-select d-inline-block mw-100" class:hidden={followSystem} on:change={changeTheme} bind:this={themeSelectBox}>
                <option selected={initialTheme === "light"} value="light">Light</option>
                <option selected={initialTheme === "dark"} value="dark">Dark</option>
                <option selected={initialTheme === "black"} value="black">Black</option>
            </select>
        </td>
    </tr>
</table>