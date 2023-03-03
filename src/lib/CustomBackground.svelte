<script>
    import {navigating} from "$app/stores";
    import {onMount} from "svelte";

    let div;

    let background = false;

    export let preview = true;
    
    export function updateCustomBackground() {
        if(typeof location === "undefined") return;
        if(typeof div === "undefined") return;
        if(isOnBackgroundablePage()) {
            if(typeof localStorage.customBackground != "undefined") {
                changeBackground(localStorage.customBackground);
            } else {
                removeBackground();
            }
        } else {
            removeBackground();
        }
    }

    function isOnBackgroundablePage() {
        return location.pathname.toLowerCase() === "/countdown" ||
            (location.pathname.toLowerCase() === "/settings/theme" && preview);
    }

    function changeBackground(base64) {
        console.log("changing background")
        background = true;
        div.style.backgroundImage = "url('"+base64+"')";
        div.style.backgroundSize = localStorage.customBackgroundFill === "true" ? "cover" : "contain";
    }
    function removeBackground() {
        div.style.backgroundImage = "none";
        background = false
    }

    onMount(() => {
        updateCustomBackground();
    })

    $: updateCustomBackground($navigating);
    $: updateCustomBackground(preview);
</script>
<style>
    div {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -100;
        height: 99vh;
        width: 99vw;
        margin: 0;
        padding: 0;
        background-repeat: no-repeat;
        background-position: center;
    }

    .hidden {
        display: none;
    }
</style>
<div bind:this={div} class:hidden={!background}></div>