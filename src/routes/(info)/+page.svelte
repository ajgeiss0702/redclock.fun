<script>
    import {goto} from "$app/navigation";
    import {paths as oldPaths} from "$lib/oldPaths.js";
    import {getScheduleCode, getSchoolCode} from "$lib/utils.js";
    import {browser} from "$app/environment";
    import {SlideToggle} from "@skeletonlabs/skeleton";
    import {page} from "$app/stores";

    if(browser && (localStorage.alwaysRedirect || "false") === "true" && !$page.url.searchParams.has("noRedirect")) {
        let hash = location.hash.split('#').splice(1).join('#');
        if(Object.keys(oldPaths).includes(hash)) {
            goto("/" + oldPaths[hash]);
        } else if(_GET("rmtv") === "undefined") {
            goto("/rmtv");
        } else if(typeof getSchoolCode() === 'undefined') {
            goto("/schools")
        } else if(typeof getScheduleCode() === 'undefined') {
            goto("/schedules")
        } else {
            goto("/countdown")
        }
    }

    let alwaysRedirect = browser && (localStorage.alwaysRedirect || "false") === "true";

    $: {
        if(browser) {
            localStorage.alwaysRedirect = alwaysRedirect;
            if(alwaysRedirect && !$page.url.searchParams.has("noRedirect")) {
                if(localStorage.school) {
                    goto("/countdown");
                } else {
                    goto("/schools");
                }
            }
        }
    }
</script>
<style>
    h1 > span {
        font-size: 2em !important;
    }
</style>

<br>
<h1>
    <img src="/red_clock.png" class="inline-block" style="height: 25vh; width: 25vh;" alt="Red Clock logo"><br>
    <br>
    <span class="bg-gradient-to-br from-primary-600 via-primary-400 to-primary-500 bg-clip-text text-transparent box-decoration-clone">
        Red Clock
    </span>
</h1>
<br>
<h2>Count down until the bell rings</h2>
<br>
<br>

<div class="inline-block card p-4">
    <h3>Looking for the countdown?</h3>
    <a class="btn variant-glass-primary" href={browser && localStorage.school ? "/countdown" : "/schools"}>
        {#if browser && localStorage.school}
            Go to Countdown
        {:else}
            Select a School
        {/if}
    </a>
    <br>
    <br>
    <SlideToggle
            size="sm"
            name="always-redirect"
            bind:checked={alwaysRedirect}

    >
        Always redirect to countdown?
    </SlideToggle>
</div>
