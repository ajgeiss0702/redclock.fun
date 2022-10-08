<script>
    import {onMount} from "svelte";
    import '../selectbox.css';

    export let name;
    export let image;


    let style = "background-image: url(\"" + image + "\")"
</script>

<div class="sb-background" {style} on:click>
    <div class="sb-container">
        <span class="sb">{name}</span>
    </div>
</div>