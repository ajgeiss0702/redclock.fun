<script>
    import {AppBar, drawerStore} from "@skeletonlabs/skeleton";
    import NavLinks from "$lib/info/NavLinks.svelte";
    import MenuIcon from "svelte-bootstrap-icons/lib/List.svelte"
    import {browser} from "$app/environment";

    let root = "/";
    if(browser && (localStorage.alwaysRedirect || "false") === "true") root = "/?noRedirect"
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

    :global(.mobileLinkExpander) {
        display: none;
    }

    @media (max-width: 890px) {
        .links {
            display: none;
        }
        :global(.mobileLinkExpander) {
            display: block;
        }
    }

</style>
<div class="text-left sticky top-0 w-full">
    <AppBar padding="p-2" slotTrail="mobileLinkExpander pr-3">
        <svelte:fragment slot="lead">
            <a href={root} aria-label="Red Clock Logo">
                <img src="/red_clock.png" alt="">
            </a>
            <a href={root}>
                <h2 class="pl-4">Red Clock</h2>
            </a>
        </svelte:fragment>
        <div class="links">
            <NavLinks/>
        </div>
        <svelte:fragment slot="trail">
            <div class="mobileLinkExpander">
                <button
                        class="hidden-button"
                        on:click={() => {drawerStore.open({ id: "sideNavBar", position: "right"})}}
                        aria-label="Navigation Menu"
                >
                    <MenuIcon style="height: 2.5em; width: 2.5em;"/>
                </button>
            </div>
        </svelte:fragment>
    </AppBar>
</div>


<slot/>