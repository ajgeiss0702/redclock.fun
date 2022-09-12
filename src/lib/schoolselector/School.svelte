<script>
    import {onMount} from "svelte";

    export let name;
    export let image;

    let divElement;

    onMount(() => {
        divElement.style.backgroundImage = "url(\"" + image + "\")";
    })
</script>
<style>
    * {
        transition: 0.3s;
    }
    div.background {
        display: inline-block;

        cursor: pointer;

        border-radius: 1em;
        height: 5em;
        width: 10em;
        margin: 1em;



        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;

        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }
    div.container:hover {
        background-color: rgba(5, 5, 5, 0.4);
    }
    span {
        position: absolute;
        display: inline-block;
        width: 10em;
        color: rgba(0, 0, 0, 0);
    }
    div.container:hover > span {
        color: white;
    }

    div.container {
        display: flex;

        height: 100%;
        width: 100%;

        border-radius: 1em;
        padding: 0;

        align-items: center;
    }

</style>

<div class="background" bind:this={divElement} on:click>
    <div class="container">
        <span>{name}</span>
    </div>
</div>