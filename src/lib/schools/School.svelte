<script>
    import {onMount} from "svelte";
    import '$lib/css/selectbox.css';

    export let name;
    export let image;

    if(image.startsWith("https://redclock.fun")) {
        image = image.substring("https://redclock.fun".length)
    }


    let style = "background-image: url(\"" + image + "\")"
</script>

<div class="sb-background" {style} on:click>
    <div class="sb-container">
        <span class="sb">{name}</span>
    </div>
</div>