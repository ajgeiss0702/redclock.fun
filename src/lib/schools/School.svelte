<script>
    import '$lib/css/selectbox.css';

    export let code;
    export let name;
    export let image;

    if(image.startsWith("https://redclock.fun")) {
        image = image.substring("https://redclock.fun".length)
    }


    let style = "background-image: url(\"" + image + "\")"
</script>

<a class="hidden-button sb-background" {style} on:click|preventDefault href="/schedules?school={code}">
    <span class="sb-container">
        <span class="sb">{name}</span>
    </span>
</a>