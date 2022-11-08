<script>
    import {Doughnut} from "svelte-chartjs";
    import 'chart.js/auto';
    import {onDestroy, onMount} from "svelte";
    import {safeLength} from "$lib/utils.js";

    let chart;

    let data = {
        datasets: [{
            label: 'Users',
            backgroundColor: ['darkgreen', 'orange'],
            data: []
        }],
        labels: [
            "Desktop",
            "Browser"
        ]
    };

    async function update() {
        let fetchedData = await fetch("https://api.redclock.fun/checkin/desktop").then(r => r.json());

        data.datasets[0].data = [
            safeLength(fetchedData["true"]),
            safeLength(fetchedData["false"]),
        ];
        chart.update();
    }

    let updateInterval;
    onMount(() => {
        update();
        updateInterval = setInterval(update, 10e3);
    })

    onDestroy(() => {
        clearInterval(updateInterval);
    })
</script>
<style>
</style>
<Doughnut height="400" width="400" bind:chart {data}/>