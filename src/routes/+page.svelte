<script>
    export const ssr = false;
    import {onMount} from "svelte";

    onMount(() => {
        if(typeof localStorage.school === 'undefined') {
            location.href = "/schools";
        } else if(typeof localStorage.schedule === 'undefined') {
            location.href = "/schedules";
        }
    })
</script>