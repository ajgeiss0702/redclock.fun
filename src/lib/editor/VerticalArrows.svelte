<script lang="ts">
    import {ArrowUp, ArrowDown} from "svelte-bootstrap-icons";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();

    export let allowUp = true;
    export let allowDown = true;

    function up() {
        dispatch("up")
    }
    function down() {
        dispatch("down")
    }
</script>
<div>
    <button on:click={up} disabled={!allowUp}><ArrowUp/></button>
    <button on:click={down} disabled={!allowDown}><ArrowDown/></button>
</div>

<style>
    button {
        @apply px-2 py-2;
        font-size: 5em;
        border-radius: 7px;
        transition: 100ms;
    }
    button:hover:not([disabled]) {
        background-color: rgba(0, 0, 0, 0.1);
    }
    :global(.dark) button:hover:not([disabled]) {
        background-color: rgba(255, 255, 255, 0.1);
    }
</style>