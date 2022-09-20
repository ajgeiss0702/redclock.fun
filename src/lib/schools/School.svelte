<script>
    import {onMount} from "svelte";
    import '../selectbox.css';

    export let name;
    export let image;

    let divElement;

    onMount(() => {
        divElement.style.backgroundImage = "url(\"" + image + "\")";
    })
</script>

<div class="sb-background" bind:this={divElement} on:click>
    <div class="sb-container">
        <span class="sb">{name}</span>
    </div>
</div>