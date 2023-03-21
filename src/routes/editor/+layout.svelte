<script>
    import {AppBar, Drawer, drawerStore} from "@skeletonlabs/skeleton";
    import MenuIcon from "svelte-bootstrap-icons/lib/List.svelte"
    import EditorNavLinks from "$lib/editor/EditorNavLinks.svelte";

    import X from "svelte-bootstrap-icons/lib/X.svelte";
    import UserInfo from "$lib/editor/UserInfo.svelte";

    export let data;
</script>
<svelte:head>
    <meta name="description" content="Red Clock is a website that counts down until the bell rings at your school.">
</svelte:head>
<style>
    img {
        height: 3em;
        width: 3em;
        align-self: center;
    }

    .mobileLinkExpander {
        display: none;
    }
    .userInfo {
        display: block;
    }

    @media (max-width: 890px) {
        .links {
            display: none;
        }
        .mobileLinkExpander {
            display: block;
        }
        .userInfo {
            display: none;
        }
    }

</style>
<div class="text-left sticky top-0 w-full mb-2">
    <AppBar padding="p-2" slotTrail="mobileLinkExpander pr-3" background="bg-primary-100-800-token">
        <svelte:fragment slot="lead">
            <a href="/editor" aria-label="Red Clock Logo">
                <img src="/red_clock.webp" alt="">
            </a>
            <a href="/editor">
                <h2 class="pl-4">Red Clock Editor</h2>
            </a>
        </svelte:fragment>
        <div class="links">
            <EditorNavLinks/>
        </div>
        <svelte:fragment slot="trail">
            <div class="mobileLinkExpander">
                <button
                        class="hidden-button"
                        on:click={() => {drawerStore.open({ id: "editorSideNavBar", position: "right"})}}
                        aria-label="Navigation Menu"
                >
                    <MenuIcon style="height: 2.5em; width: 2.5em;"/>
                </button>
            </div>
            <div class="userInfo">
                <UserInfo user={data?.user}/>
            </div>
        </svelte:fragment>
    </AppBar>
</div>

<slot/>

<Drawer bgDrawer="bg-primary-100-800-token">
    {#if $drawerStore.id === "editorSideNavBar" || $drawerStore.id === "editorSideNavBar"}
        <button class="btn p-2 ml-2 block" on:click={() => drawerStore.close()}>
            <X style="height: 3em; width: 3em;"/>
        </button>
        <div class="text-center p-2 ">
            <EditorNavLinks vertical={true} user={data?.user}/>
        </div>
    {/if}
</Drawer>