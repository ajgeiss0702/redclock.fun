<script>
    export let data;

    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";
</script>

<div class="text-left mx-4">
    <a href=".." class="hover-underline">
        <CaretLeftFill class="inline-block"/>
        Back
    </a>
</div>

<div class="flex justify-items-center">
    <div class="inline-block p-2 text-left mx-auto flex">
        <div class="flex-none self-center">
            <img src={data.school.logo} style="max-height: 6em;" alt="{data.school.code}">
        </div>
        <div class="flex-1 self-center">
            <h2>{data.school.display}</h2>
            <span class="text-surface-400-500-token">
                {data.school.code}
            </span>
        </div>
    </div>
</div>
<br>

<slot/>