<script>
    import {Line} from "svelte-chartjs";
    import {last30} from "$lib/utils";
    import {CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement} from "chart.js";
    ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement)

    let data = {
        labels: last30(),
        datasets: [
            {
                label: 'Users',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: []
            }
        ]
    }

    let chart;

    let l30 = last30();
    for (let i = 0; i < l30.length; i++) {
        let date = l30[i];
        let format = date.replace(/\//g, ".");
        (async () => {
            data.datasets[0].data[i] = Number(
                await fetch("https://api.redclock.fun/checkin/date/" + format).then(r => r.text())
            );
            chart.update();
        })();
    }

    let loadedDate = new Date().getDate();
    setInterval(async () => {
        let now = new Date();
        if(loadedDate !== now.getDate()) {
            location.href = "";
        }

        data.datasets[0].data[data.datasets[0].data.length-1] = Number(
            await fetch("https://api.redclock.fun/checkin/today").then(r => r.text())
        );
        chart.update();
    }, 10e3);

</script>
<Line
        {data}
        bind:chart
        style='width: 100vw;height: 85vh;padding:0;margin: 0 0 -2vh;'
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