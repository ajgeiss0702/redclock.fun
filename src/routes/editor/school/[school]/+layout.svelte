<script>
    export let data;

    import {page} from "$app/stores";

    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";
</script>

<div class="text-left mx-4">
    <a href={$page.url.pathname.endsWith(data.school.code) ? "/editor" : "/editor/school/" + data.school.code} class="hover-underline">
        <CaretLeftFill class="inline-block"/>
        Back to {$page.url.pathname.endsWith(data.school.code) ? "school list" : data.school.display}
    </a>
</div>

<div class="flex justify-items-center">
    <div class="inline-block pb-2 text-left mx-auto flex">
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

<slot/>