<script>

    import {browser} from "$app/environment";
    import {tomorrow} from "$lib/utils.js";
    import {onDestroy} from "svelte";
    import {create, get, off, onChange} from "$lib/settings";

    let festive = false;
    let festiveExtension;
    function checkFestiveness() {
        let month = new Date().getMonth();
        if(month === 10 || month === 11) {
            create("festive", true, "Festive", "Holiday festiveness");
            if(!get("festive")) {
                festive = false;
                return;
            }
            if(month === 11) {
                festive = "lights";
                festiveExtension = "gif";
            } else if(month === 10) {
                festive = "turkey";
                festiveExtension = "gif";
            }
        } else {
            festive = false;
        }
    }

    let updateTimeout;
    let updateInterval;

    if(browser) {
        updateTimeout = setTimeout(() => {
            checkFestiveness();
            updateInterval = setInterval(checkFestiveness, 24 * 60 * 60 * 1e3);
        }, (tomorrow(true).getTime() - Date.now()) + 1e3)
        checkFestiveness();

        onChange("festive", checkFestiveness);
    }

    onDestroy(() => {
        clearTimeout(updateTimeout);
        clearInterval(updateInterval);

        off("festive", checkFestiveness);
    })
</script>
<style>
    div {
        position: fixed;
        top: 0;
        left: 0;
        width: 15vw;
        text-align: left;

        pointer-events: none;
    }

    :global(.layout-mirrored) div {
        left: auto;
        right: 0;
        text-align: right;
    }

    .festive-turkey {
        max-width: 9vw;
        transform: rotate(-10deg) translateX(10%) translateY(10%);
    }
    :global(.layout-mirrored) .festive-turkey {
        transform: rotate(10deg) translateX(-10%) translateY(10%);
    }


    .festive-lights {
        transform: scale(65%) translateX(-30%) translateY(-30%);
    }
    :global(.layout-mirrored) .festive-lights {
        transform: scale(-65%, 65%) translateX(30%) translateY(-30%) ;
    }

    @media (orientation: portrait) {
        img {
            width: 40vw;
        }
    }
</style>
{#if festive}
    <div>
        <img src="/img/festive/{festive}.{festiveExtension}" class="festive-{festive}" alt="{festive}">
    </div>
{/if}