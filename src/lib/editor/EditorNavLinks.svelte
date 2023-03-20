<span class:vertical={vertical}>
    <a href="/">Main Site</a>
    {#if vertical}
        <br>
        <hr>
        <br>
        <UserInfo {user}/>
    {/if}
</span>


<style>
    a {
        padding-left: 1em;

        color: inherit !important;
    }

    .vertical > a {
        display: block;
        font-size: 1.5em;
    }
</style>
<script lang="ts">
    import UserInfo from "$lib/editor/UserInfo.svelte";

    export let vertical: boolean;

    export let user: User;

</script>