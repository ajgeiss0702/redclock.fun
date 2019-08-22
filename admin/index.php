<html>
  <head>
    <style>
    body,html {
      padding: 0;
      margin: 0;
    }
    </style>
    <script src='/js/jquery.min.js'></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0" defer></script>
    <script src="/js/base.js"></script>
  </head>
  <body onload='load()'>
    <div style='text-align: center;margin-left:auto;margin-right:auto;'>
      <canvas id='usergraph' style='width: 100vw;height: 85vh;padding:0;margin:0;margin-bottom: -2vh;'></canvas>
      <h1 id='usercount' style='line-height: 15vh;font-size:15vh;padding:0;margin:0;'>0</h1>
      <span id="uusercountyesterday" style='color:grey;'></span> &nbsp;
      <span id="uusercount"></span>
    </div>
  </body>
  <script defer>
  var userchart;
  var onetwenty = [];
  (() => {
    var i = 119;
    while(i > 0) {
      i--;
      onetwenty.push(i);
    }
  })()
  function load() {
    userchart = new Chart(document.getElementById('usergraph').getContext('2d'), {
      type: 'line',
      data: {
        labels: onetwenty,
        datasets: [{
          label: 'Users',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: []
        }]
      },
      options: {
        hover: {
          enabled: true,
          intersect: false
        },
        elements: {
          point: 'line'
        },
        scales: {
            yAxes: [{
                ticks: {
                  suggestedMax: 20,
                  beginAtZero: true

                }
            }]
        }
    }
    });
    update();
  }

  async function updateUserChart() {
    var data = JSON.parse(await httpGet('https://api.redclock.fun/checkin/history'));
    while(data.length < 120) {
      data.unshift(0);
    }
    userchart.data.datasets[0].data = data;
    userchart.update()
  }

  var first = true;
  async function updateUserCount() {
    var raw = await httpGet('https://api.redclock.fun/checkin/')
    var data = Number(raw);
    if(data+"" == 'NaN') {
      console.error(raw);
      return;
    }

    numberSlide(data, $('#usercount'), 1);
    if(first) {
      first = false;
    }
  }
  async function updateUniqueUserCount() {
    var raw = await httpGet("https://api.redclock.fun/checkin/today");
    var data = Number(raw)
    if(data+"" == 'NaN') {
      console.error(raw);
      return;
    }
    numberSlide(data, $('#uusercount'), 1);
  }

  async function updateYesterdayUniqueUsers() {
    var raw = await httpGet("https://api.redclock.fun/checkin/yesterday");
    var data = Number(raw)
    if(data+"" == 'NaN') {
      console.error(raw);
      return;
    }
    numberSlide(data, $('#uusercountyesterday'), 1);
  }

  function update() {
    updateUserChart();
    updateUserCount();
    updateUniqueUserCount();
    updateYesterdayUniqueUsers();
  }
  setInterval(update, 10e3);




  function numberSlide(number, element, delay = 5) {
    if(typeof element == 'undefined') return false;
    var a = document.createElement('div');
    var b = element.html().replace(/,/g, '');
    a.innerHTML = b;
  	$( a ).animate({
      innerHTML: number
    }, {
      step: function( now, fx ) {
        var s = Math.round(Number(now));
        element.html(commas(s));
      },
      duration: delay * 1e3
    });
  }

  </script>
</html>
