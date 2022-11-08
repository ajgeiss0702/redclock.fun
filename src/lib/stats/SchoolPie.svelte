<script>
    import {Doughnut} from "svelte-chartjs";
    import 'chart.js/auto';
    import {onDestroy, onMount} from "svelte";
    import {safeLength} from "$lib/utils.js";

    let chart;

    let data = {
        datasets: [{
            label: 'Users',
            backgroundColor: ['rgb(255, 50, 50)', 'blue', 'yellow', 'aqua', 'rgb(114,32,50)'],
            data: []
        }],
            labels: [
            "Red Mountain",
            "Mesa Virtual Academy",
            "AAEC RM",
            "Shepherd",
            "E Gaston"
        ]
    };

    async function update() {
        let fetchedData = await fetch("https://api.redclock.fun/checkin/schools").then(r => r.json());

        data.datasets[0].data = [
            safeLength(fetchedData["rmhs"]),
            safeLength(fetchedData["mvc"]),
            safeLength(fetchedData["aaec-rm"]),
            safeLength(fetchedData["shepherd"]),
            safeLength(fetchedData["eghs"])
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