<script>
    import {goto} from "$app/navigation";

    export const ssr = false;
    import {onMount} from "svelte";
    import {paths as oldPaths} from "$lib/oldPaths.js";

    onMount(() => {
        let hash = location.hash.split('#').splice(1).join('#');
        if(Object.keys(oldPaths).includes(hash)) {
            goto("/" + oldPaths[hash]);
            return;
        }

        if(typeof localStorage.school === 'undefined') {
            goto("/schools")
        } else if(typeof localStorage.schedule === 'undefined') {
            goto("/schedules")
        } else {
            goto("/countdown")
        }
    })
</script>