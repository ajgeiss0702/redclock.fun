<script>
    import {onMount} from "svelte";
    import News from "$lib/countdown/sidebar/News.svelte";
    import Settings from "$lib/countdown/sidebar/Settings.svelte";
    import ScheduleList from "$lib/countdown/sidebar/ScheduleList.svelte";
    import {browser, dev} from "$app/environment";
    import Quote from "$lib/countdown/sidebar/Quote.svelte";
    import Links from "$lib/countdown/sidebar/Links.svelte";
    import {Tab, TabGroup} from "@skeletonlabs/skeleton";
    import {_GET} from "$lib/utils";

    let tab = '';

    let currentTab = browser ? (localStorage.tabId || "news") : "";

    let unreadNews = 0;
    let totalNews = 0;

    onMount(() => {
        tab =  typeof localStorage.tabId === "undefined" ? "news" : localStorage.tabId;
        if(tab.startsWith("sidebar-tab-")) tab = tab.substring("sidebar-tab-".length); // fix tab data from v3
        if(tab === "times") tab = "schedule"
        if(_GET("layout")) tab = "news";

        currentTab = tab;
    });

    $: {
        if(browser && currentTab !== '') localStorage.tabId = currentTab;
        if(browser && currentTab === "news" && totalNews > 0) {
            localStorage.lastReadNews = totalNews;
            unreadNews = 0;
        }
    }
</script>
<style>
    .sidebar {
        width: 32vw;
        min-height: 97vh;
        margin-top: 1vh;
        border-radius: 8px;
    }
    :global(.layout-default) .sidebar {
        margin-left: 66.5vw;
    }
    :global(.layout-mirrored) .sidebar {
        margin-right: auto;
        margin-left: 0.5vw;
    }
    :global(.layout-large) .sidebar, :global(.layout-countdown) .sidebar {
        width: auto !important;
        margin: auto !important;
    }

    .sidebar {
        background-color: rgba(242, 242, 242, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    :global(.dark) .sidebar {
        background-color: rgba(52, 52, 52, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    :global(.black) .sidebar {
        background-color: transparent;
        border-color: rgba(255, 255, 255, 0.15);
        border-style: solid;
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .preview-text {
        display: inline-block;
        font-size: 9em;
        transform: rotate(90deg);
        line-height: 1em;
    }

    .badge {
        text-decoration: none;
    }

    @media (orientation: portrait) {
        .sidebar {
            width: auto !important;
            margin: auto !important;
        }
    }
</style>
<div class="sidebar" class:center={!(!browser || !_GET("preview"))}>
    {#if !browser || !_GET("preview")}
        <Quote/>
        {#key tab}
            <TabGroup>
                <Tab value="news" name="News" bind:group={currentTab}>
                    <svelte:fragment slot="lead">
                        {#if unreadNews > 0}
                            <span class="badge rounded-pill text-bg-danger">{unreadNews}</span>
                        {/if}
                    </svelte:fragment>
                    News
                </Tab>
                <Tab value="schedule" name="Schedule" bind:group={currentTab}>
                    Schedule
                </Tab>
                <Tab value="settings" name="Settings" bind:group={currentTab}>
                    Settings
                </Tab>
                <Tab value="links" name="Links" bind:group={currentTab}>
                    Links
                </Tab>
                <svelte:fragment slot="panel">
                    {#if currentTab === "news"}
                        <News bind:unreadCount={unreadNews} bind:newsLength={totalNews} {currentTab}/>
                    {:else if currentTab === "schedule"}
                        <ScheduleList/>
                    {:else if currentTab === "settings"}
                        <Settings/>
                    {:else if currentTab === "links"}
                        <Links/>
                    {/if}
                </svelte:fragment>
            </TabGroup>
        {/key}
    {:else}
        <span class="preview-text">
            Side bar
        </span>
    {/if}
</div>