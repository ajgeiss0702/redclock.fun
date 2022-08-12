<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Day Graph</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.5.1/dist/chart.min.js?t=1" defer></script>
    <link rel='stylesheet' id='theme-changer' href='/css/themes/<?php
    if(isset($_COOKIE['theme'])) {
        echo($_COOKIE['theme']);
    } else {
        echo('light');
    }
    ?>.css?r=1'>
    <script>
        let rcf = {};
        rcf.on = () => {};
    </script>
    <script src="https://redclock.fun/js/base.js?"></script>
</head>
<body onload="load()">

<canvas id='usergraph' style='width: 100vw;height: 85vh;padding:0;margin: 0 0 -2vh;'></canvas>
<script>
    let userChart;
    function load() {
        userChart = new Chart(document.getElementById('usergraph').getContext('2d'), {
            type: 'line',
            data: {
                labels: last30(),
                datasets: [
                    {
                        label: 'Total',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: []
                    }
                ]
            },
            options: {
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
            }
        });

        let l30 = last30();
        for (let i = 0; i < l30.length; i++) {
            let date = l30[i];
            let format = date.replace(/\//g, ".");
            (async () => {
                userChart.data.datasets[0].data[i] = Number(
                    await httpGet("https://api.redclock.fun/checkin/date/" + format)
                );
                userChart.update();
            })();
        }
    }

    let loadedDate = new Date().getDate();
    setInterval(async () => {
        let now = new Date();
        if(loadedDate !== now.getDate()) {
            location.href = "";
        }

        userChart.data.datasets[0].data[userChart.data.datasets[0].data.length-1] = Number(
            await httpGet("https://api.redclock.fun/checkin/today")
        );
        userChart.update();
    }, 10e3);

    /**
     * @returns {String[]}
     */
    function last30() {
        let date = new Date();
        let dates = [];
        for (let i = 0; i < 30; i++) {
            dates.push((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
            date.setDate(date.getDate()-1);
        }
        return dates.reverse();
    }
</script>
</body>
</html>