<script>
    import '../theme.css';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.css';


    import NProgress from "nprogress";
    import {navigating, page} from "$app/stores";
    import "$lib/css/misc.css";

    // For Skeleton's popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import {Drawer, drawerStore, storePopup} from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    // NProgress css
    import "nprogress/nprogress.css";

    import {browser} from "$app/environment";
    import NavLinks from "$lib/info/NavLinks.svelte";
    import X from "svelte-bootstrap-icons/lib/X.svelte";
    import {afterNavigate} from "$app/navigation";

    if (browser) {
        import("$lib/how_many_people");
    }

    NProgress.configure({
        // Full list: https://github.com/rstacruz/nprogress#configuration
        minimum: 0.16,
    });

    let progressTimeout;

    $: {
        if ($navigating) {
            clearTimeout(progressTimeout);
            progressTimeout = setTimeout(() => {
                if ($navigating) {
                    NProgress.start();
                }
            }, 150);
        }
        if (!$navigating) {
            clearTimeout(progressTimeout);
            NProgress.done();
        }
    }

    afterNavigate(() => {
        drawerStore.close();
    })
</script>

{#if !$page.url.pathname.startsWith("/editor")}
    <Drawer>
        {#if $drawerStore.id === "sideNavBar"}
            <button class="btn p-2 ml-2 closeButton" on:click={() => drawerStore.close()}>
                <X style="height: 3em; width: 3em;"/>
            </button>
            <div class="text-center">
                <NavLinks vertical={true}/>
            </div>
        {/if}
    </Drawer>
{/if}

<svelte:head>
    {#if $page.url.hostname !== "redclock.fun"}
        <meta name="robots" content="noindex">
    {/if}
</svelte:head>

<slot/>

<style>

    .closeButton {
        display: block;
    }

    :global(#nprogress .spinner-icon) {
        border-top-color: #f00;
        border-left-color: #f00;
    }

    :global(#nprogress .peg) {
        box-shadow: 0 0 10px #f00, 0 0 5px #f00;
    }

    :global(#nprogress .bar) {
        background: #f00;
    }
</style>
