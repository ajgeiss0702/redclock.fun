<script>
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import {paths as oldPaths} from "$lib/oldPaths.js";
    import {_GET, getScheduleCode, getSchoolCode} from "$lib/utils.js";

    onMount(() => {
        let hash = location.hash.split('#').splice(1).join('#');
        if(Object.keys(oldPaths).includes(hash)) {
            goto("/" + oldPaths[hash]);
            return;
        }

        if(_GET("rmtv") === "undefined") {
            goto("/rmtv");
            return;
        }

        if(typeof getSchoolCode() === 'undefined') {
            goto("/schools")
        } else if(typeof getScheduleCode() === 'undefined') {
            goto("/schedules")
        } else {
            goto("/countdown")
        }
    })
</script>

<style>
    div {
        position: fixed;
        top: 0;
        left: 0;

        height: 100vh;
        width: 100vw;
        z-index: -100;
        background-image: url("/img/loading.svg");
        background-position: center;
        background-repeat: no-repeat;
    }

</style>
<div></div>