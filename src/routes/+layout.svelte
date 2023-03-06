<script>
    import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.postcss';


    import NProgress from "nprogress";
    import {navigating} from "$app/stores";
    import "$lib/css/misc.css";

    // For Skeleton's popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    // NProgress css
    import "nprogress/nprogress.css";

    import {browser} from "$app/environment";

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

<slot/>

<style>
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
