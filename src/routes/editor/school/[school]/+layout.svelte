<script>
    import School from "$lib/editor/School.svelte";
    import {page} from "$app/stores";
    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";

    export let data;

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

<School school={data.school}/>

<slot/>