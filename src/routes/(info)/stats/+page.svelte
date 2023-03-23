<svelte:head>
    <title>Stats - Red Clock</title>
</svelte:head>
<script>
    import UserGraph from "$lib/stats/UserGraph.svelte";
    import UserNumbers from "$lib/stats/UserNumbers.svelte";
    import SchoolPie from "$lib/stats/SchoolPie.svelte";
    import PlatformPie from "$lib/stats/PlatformPie.svelte";
    import HostPie from "$lib/stats/HostPie.svelte";
    import ReloadButton from "$lib/stats/ReloadButton.svelte";
</script>
<style>
    div {
        text-align: center;
        padding-bottom: 20em;
    }
    table {
        margin: auto;
    }
</style>
<div>
    <UserGraph/>
    <UserNumbers/>
    <table>
        <tr>
            <td><SchoolPie/></td>
            <td><PlatformPie/></td>
        </tr>
        <tr>
            <td><HostPie/></td>
        </tr>
    </table>
    <br>
    <br>
    <br>
    <ReloadButton/>
</div>