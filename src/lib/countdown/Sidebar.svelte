<script>
    import { TabContent, TabPane } from 'sveltestrap';
    import {onMount} from "svelte";
    import News from "$lib/countdown/sidebar/News.svelte";
    import Settings from "$lib/countdown/sidebar/Settings.svelte";
    import ScheduleList from "$lib/countdown/sidebar/ScheduleList.svelte";
    import {browser} from "$app/environment";
    import Quote from "$lib/countdown/sidebar/Quote.svelte";

    let tab = '';

    let currentTab;

    let unreadNews = 0;
    let totalNews = 0;

    onMount(() => {
        tab =  typeof localStorage.tabId === "undefined" ? "news" : localStorage.tabId;
        if(tab.startsWith("sidebar-tab-")) tab = tab.substring("sidebar-tab-".length); // fix tab data from v3
        if(tab === "times") tab = "schedule"
        if(_GET("layout")) tab = "news";

        currentTab = tab;
    });

    function changeTab(e) {
        currentTab = e.detail;
        if(e.detail !== '') localStorage.tabId = e.detail;
        if(e.detail === "news" && totalNews > 0) {
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
            <TabContent on:tab={changeTab}>
                <TabPane tabId="news" tab="News" active={tab === "news"}>
                    <span slot="tab">
                        {#if unreadNews > 0}
                            <a class="badge rounded-pill text-bg-danger">{unreadNews}</a>
                        {/if}
                    </span>
                    <News bind:unreadCount={unreadNews} bind:newsLength={totalNews} {currentTab}/>
                </TabPane>
                <TabPane tabId="schedule" tab="Schedule" active={tab === "schedule"}>
                    <ScheduleList/>
                </TabPane>
                <TabPane tabId="settings" tab="Settings" active={tab === "settings"}>
                    <Settings/>
                </TabPane>
                <TabPane class="text-center" tabId="links" tab="Links" active={tab === "links"}>
                    <h1>Links</h1>

                    <a class="btn btn-primary" href="https://discord.gg/shSg6r8" target="_blank">
                        <img src="/img/icons/discord.svg" style="height: 1em;" alt="Discord icon"> Discord
                    </a><br>
                    <br>
                    <a class="btn btn-secondary" href="https://app.feedbacky.net/p/redclockfun" target="_blank">
                        Suggest a feature
                    </a><br>
                    <br>
                    <a class="btn btn-outline-danger" href="/desktop">Desktop App</a><br>
                    <br>
                    <a class="btn btn-outline-secondary" href="/lightweight">Lightweight</a>
                </TabPane>
            </TabContent>
        {/key}
    {:else}
        <span class="preview-text">
            Side bar
        </span>
    {/if}
</div>