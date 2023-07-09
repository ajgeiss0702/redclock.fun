<script>
    import '../css/selectbox.css';
    export let name;
    export let school;
    export let code;
</script>

<style>
    div.sb-container > span {
        color: white;
    }
</style>

<a class="hidden-button sb-background" on:click|preventDefault href="/countdown?school={school}&schedule={code}&set">
    <div class="sb-container">
        <span class="sb">{name}</span>
    </div>
</a>