<script>
    import NProgress from 'nprogress';
    import { navigating } from '$app/stores';

    // NProgress css
    import 'nprogress/nprogress.css';

    import 'bootstrap/dist/css/bootstrap.min.css';
    import {browser} from "$app/environment";

    if(browser) {
        import("$lib/how_many_people.js")
    }

    NProgress.configure({
        // Full list: https://github.com/rstacruz/nprogress#configuration
        minimum: 0.16
    });

    $: {
        if ($navigating) {
            NProgress.start();
        }
        if (!$navigating) {
            NProgress.done();
        }
    }
</script>
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
<slot></slot>