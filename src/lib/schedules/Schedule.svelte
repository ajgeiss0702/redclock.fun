<script>
    import '../css/selectbox.css';
    export let name;
</script>

<style>
    div.sb-container > span {
        color: white;
    }
</style>

<div class="sb-background" on:click>
    <div class="sb-container">
        <span class="sb">{name}</span>
    </div>
</div>