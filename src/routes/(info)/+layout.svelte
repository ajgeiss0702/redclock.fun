<script>
    import {AppBar, Drawer, drawerStore} from "@skeletonlabs/skeleton";
    import NavLinks from "$lib/info/NavLinks.svelte";
    import {List as MenuIcon} from "svelte-bootstrap-icons";
</script>
<style>
    img {
        height: 3em;
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
<div class="text-left">
    <AppBar padding="p-2" slotTrail="mobileLinkExpander pr-3">
        <svelte:fragment slot="lead">
            <a href="/">
                <img src="/red_clock.png" alt="">
            </a>
            <a href="/">
                <h2 class="pl-4">Red Clock</h2>
            </a>
        </svelte:fragment>
        <div class="links">
            <NavLinks/>
        </div>
        <svelte:fragment slot="trail">
            <div class="mobileLinkExpander">
                <button class="hidden-button" on:click={() => {drawerStore.open({ id: "sideNavBar", position: "right"})}}>
                    <MenuIcon style="height: 2.5em; width: 2.5em;"/>
                </button>
            </div>
        </svelte:fragment>
    </AppBar>
</div>


<slot/>