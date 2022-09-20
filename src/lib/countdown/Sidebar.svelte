<script>
    import { TabContent, TabPane } from 'sveltestrap';
    import {onMount} from "svelte";

    let tab = '';

    $: console.log({tab});

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
</style>
<div class="sidebar">
    {#key tab}
        <TabContent on:tab={(e) => {if(e.detail !== '') localStorage.tabId = e.detail}}>
            <TabPane tabId="news" tab="News" active={tab === "news"}>
                news and stuff
            </TabPane>
            <TabPane tabId="schedule" tab="Schedule" active={tab === "schedule"}>
                schedule and stuff
            </TabPane>
            <TabPane tabId="settings" tab="Settings" active={tab === "settings"}>
                settings and stuff
            </TabPane>
            <TabPane tabId="links" tab="Links" active={tab === "links"}>
                links and stuff
            </TabPane>
        </TabContent>
    {/key}
</div>