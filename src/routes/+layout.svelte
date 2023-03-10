<script>
    import '../theme.css';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.postcss';


    import NProgress from "nprogress";
    import {navigating} from "$app/stores";
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

    if (browser) {
        import("$lib/how_many_people.js");
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

    if (browser && navigator && navigator.serviceWorker) {
        console.log("Removing service workers");
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
                console.log("removing " + registration);
                registration.unregister();
            }
        });
    }
</script>

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
