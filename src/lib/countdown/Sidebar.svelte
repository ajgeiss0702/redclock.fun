<script>
    import { TabContent, TabPane } from 'sveltestrap';
    import {onMount} from "svelte";
    import News from "$lib/countdown/sidebar/News.svelte";
    import Settings from "$lib/countdown/sidebar/Settings.svelte";
    import ScheduleList from "$lib/countdown/sidebar/ScheduleList.svelte";

    let tab = '';

    onMount(() => {
        tab =  typeof localStorage.tabId === "undefined" ? "news" : localStorage.tabId;
    })
</script>
<style>
    :global(.default) .sidebar {
        width: 32vw;
        min-height: 97vh;
        margin-left: 66.5vw;
        margin-top: 1vh;
        border-radius: 8px;
    }

    .sidebar {
        background-color: rgba(242, 242, 242, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    :global(.dark) .sidebar {
        background-color: rgba(52, 52, 52, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }
    @media (orientation: portrait) {
        .sidebar {
            width: auto !important;
            margin: auto !important;
        }
    }
</style>
<div class="sidebar">
    {#key tab}
        <TabContent on:tab={(e) => {if(e.detail !== '') localStorage.tabId = e.detail}}>
            <TabPane tabId="news" tab="News" active={tab === "news"}>
                <News/>
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
                <a class="btn btn-outline-primary" href="/extensions">Allowed extensions</a><br>
                <br>
                <a class="btn btn-secondary" href="https://app.feedbacky.net/p/redclockfun" target="_blank">
                    Suggest a feature
                </a><br>
                <br>
                <a class="btn btn-outline-danger" href="/desktop">Desktop App</a>
            </TabPane>
        </TabContent>
    {/key}
</div>