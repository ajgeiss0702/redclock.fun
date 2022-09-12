<script>
    import {goto} from "$app/navigation";

    export const ssr = false;
    import {onMount} from "svelte";

    onMount(() => {
        if(typeof localStorage.school === 'undefined') {
            goto("/schools")
        } else if(typeof localStorage.schedule === 'undefined') {
            goto("/schedules")
        } else {
            goto("countdown")
        }
    })
</script>