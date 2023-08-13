<script>
    export let data;

    import {page} from "$app/stores";

    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";

    let href;
    let text;
    $: {
        let pathname = $page.url.pathname;
        if(pathname.endsWith(data.school.code)) {
            href = "/editor";
            text = "school list";
        } else if(pathname.includes("specials")) {
            href = "/editor/school/" + data.school.code + "/special"
            text = "specials";
        } else {
            href = "/editor/school/" + data.school.code;
            text = data.school.display;
        }
    }

</script>

<div class="text-left mx-4">
    <a {href} class="hover-underline">
        <CaretLeftFill class="inline-block"/>
        Back to {text}
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