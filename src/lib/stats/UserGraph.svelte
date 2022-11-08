<script>
    import {Line} from "svelte-chartjs";
    import {oneTwenty} from "$lib/oneTwenty.js";
    import 'chart.js/auto/auto.js';
    import {onDestroy, onMount} from "svelte";

    let chart;

    let data = {
        labels: oneTwenty,
        datasets: [
            {
                label: 'Total',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: []
            },
            {
                label: 'RMHS',
                backgroundColor: 'rgb(255, 50, 50)',
                borderColor: 'rgb(255, 50, 50)',
                data: []
            },
            {
                label: 'Shepherd',
                backgroundColor: 'aqua',
                borderColor: 'aqua',
                data: []
            },
            {
                label: 'MVC',
                backgroundColor: 'blue',
                borderColor: 'blue',
                data: []
            },
            {
                label: 'E Gaston',
                backgroundColor: 'rgb(114,32,50)',
                borderColor: 'rgb(114,32,50)',
                data: []
            },
        ]
    }

    async function update() {
        let users = await fetch("https://api.redclock.fun/checkin/history").then(r => r.json());
        while(users.length < 120) {
            users.unshift(0);
        }

        let total = [];
        let rmhs = [];
        let shepherd = [];
        let mvc = [];
        let eghs = [];

        for (let d of users) {
            total.push(d.total);
            rmhs.push(d.rmhs);
            shepherd.push(d.shepherd);
            mvc.push(d.mvc);
            eghs.push(d.eghs);
        }

        data.datasets[0].data = total;
        data.datasets[1].data = rmhs;
        data.datasets[2].data = shepherd;
        data.datasets[3].data = mvc;
        data.datasets[4].data = eghs;
        chart.update();
    }

    let updateInterval;
    onMount(() => {
        updateInterval = setInterval(update, 10e3);
        update();
    });

    onDestroy(() => {
        clearInterval(updateInterval);
    })
</script>
<style>
    :global(.usergraph) {
        width: 100% !important;
        height: 85vh !important;
        padding:0;
        margin: 0 0 -2vh;
    }
</style>
<div>
    <Line
            bind:chart
            data={data}
            class="usergraph"
            options={{
                hover: {
                  enabled: true,
                  intersect: false
                },
                interaction: {
                  mode: 'x',
                  intersect: false,
                  axis: 'x'
                },
                elements: {
                  point: 'line'
                },
                scales: {
                    yAxes: {
                      suggestedMax: 20,
                      suggestedMin: 0,
                      min: 0
                    }
                }
            }}
    />
</div>