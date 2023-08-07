<script lang="ts">
    import {ArrowUp, ArrowDown} from "svelte-bootstrap-icons";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();

    function up() {
        dispatch("up")
    }
    function down() {
        dispatch("down")
    }
</script>
<div>
    <button on:click={up}><ArrowUp/></button>
    <button on:click={down}><ArrowDown/></button>
</div>

<style>
    button {
        @apply px-2 py-2;
        font-size: 5em;
        border-radius: 7px;
        transition: 100ms;
    }
    button:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    :global(.dark) button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
</style>