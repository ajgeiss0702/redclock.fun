<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <style>
    body,html {
      padding: 0;
      margin: 0;
    }
    td {
      text-align: center;
    }
    .center > * {
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }
    .pie {
      display: inline-block;
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
      <br><br>
      <div class='center'>
        <table class='center'>
          <tr>
            <td id="hc-s0">0</td>
            <td id='hc-s1'>1</td>
          </tr>
        </table>
      </div>
      <div class='center'>
        <table>
          <tr>
            <td><canvas class="pie" id="schoolpie" height="400" width="400"></canvas></td>
            <!--<td><canvas class="pie" id="schedulepie" height="400" width="400"></canvas></td>-->
            <td><canvas class="pie" id="desktoppie" height="400" width="400"></canvas></td>
          </tr>
        </table>
      </div>
      <br>
      <br>
      <a class="btn btn-lg btn-warning" href="#" onclick="reloadAllPages()">Reload</a>
      <br>
      <br>
      <iframe style="height: 100vh;width:90vw;" src="https://astrophoenix.com/~aiden/api/rmf/change/"></iframe>
    </div>


  </body>
  <script defer>
  var userchart;
  var schoolpie;
  var schedulepie;
  var onetwenty = [];
  (() => {
    var i = 119;
    while(i > 0) {
      i--;
      onetwenty.push(i);
    }
  })()
  function load() {
    schoolpie = new Chart(document.getElementById("schoolpie").getContext('2d'), {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Users',
          backgroundColor: ['rgb(255, 99, 132)', 'yellow', 'aqua'],
          data: []
        }],
        labels: [
          "Red Mountain",
          "AAEC RM",
          "Shepherd"
        ]
      }
    })
    /*schedulepie = new Chart(document.getElementById("schedulepie").getContext('2d'), {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Users',
          backgroundColor: ['green', 'yellow', 'red'],
          data: []
        }],
        labels: [
          "4th lunch",
          "5th lunch",
          "RMTV"
        ]
      }
    })*/
    desktoppie = new Chart(document.getElementById("desktoppie").getContext('2d'), {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Users',
          backgroundColor: ['darkgreen', 'orange'],
          data: []
        }],
        labels: [
          "Desktop",
          "Browser"
        ]
      }
    })
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

  async function reloadAllPages() {
    var r = await swal({
      title: "Are you sure?",
      text: "If you do this multiple times, it can be very annoying!",
      icon: "warning",
      buttons: ["ok fine i won't", "DO IT!"],
      dangerMode: true,
    })
    if(r) {
      $.ajax({
        method: "POST",
        url: "https://api.redclock.fun/reload",
        data: {key: "CQy{HQn9=34[r^kht?jyJ4}fr#jHs4MNmCY7QH2fJPkW6xLgXN2Uh*phLhCx=J{2"}
      }).then((d) => {
        console.log("[RELOAD] Recieved: %o", d);
        if(d.success) {
          swal("Reloading!", "Everyone using the website and desktop app should reload within 30 seconds!", "success")
        } else {
          if(d.error) {
            swal("Something went wrong!", "Error: "+d.message+"", "error")
          } else {
            swal("Something went wrong!", "But there is no error! Raw data: "+JSON.stringify(d), "error")
          }
        }
      }).catch((e) => {
        console.log("[RELOAD] response length: "+e.responseText.length)
        if(e.responseText.length > 5) {
          var d = JSON.parse(e.responseText);
          if(d.error) {
            swal("Something went wrong!", "Error: "+d.message+"", "error")
          } else {
            swal("Something went wrong!", "But there is no error! Raw data: "+JSON.stringify(d), "error")
          }
        } else {
          swal("Something went wrong!", "Error while sending request! "+JSON.stringify(e), "error")
        }
      })
    }
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

  async function updateSchoolChart() {
    var raw = await httpGet("https://api.redclock.fun/checkin/schools");
    var data = JSON.parse(raw);
    schoolpie.data.datasets[0].data = [toNum(data["rmhs"]), toNum(data["aaec-rm"]), toNum(data["shepherd"])]
    schoolpie.update();
  }
  async function updateScheduleChart() {
    /*var raw = await httpGet("https://api.redclock.fun/checkin/schedules");
    var data = JSON.parse(raw);
    schedulepie.data.datasets[0].data = [toNum(data["4lunch"]), toNum(data["5lunch"]), toNum(data["rmtv"])]
    schedulepie.update();*/
  }
  async function updateDesktopChart() {
    var raw = await httpGet("https://api.redclock.fun/checkin/desktop");
    var data = JSON.parse(raw);
    desktoppie.data.datasets[0].data = [toNum(data["true"]), toNum(data["false"])]
    desktoppie.update();
  }

  function update() {
    updateUserChart();
    updateUserCount();
    updateUniqueUserCount();
    updateYesterdayUniqueUsers();
    healthCheck();
    updateSchoolChart();
    updateScheduleChart();
    updateDesktopChart();
  }
  setInterval(update, 10e3);

  function toNum(a) {
    if(typeof a != 'object') {
      return 0;
    } else {
      return a.length;
    }
  }


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


  function healthCheck() {
    hci = 0;
    hcCheck(8000, 0);
    hcCheck(8001, 1)
  }
  function hcCheck(b, num) {
    var backend = Number(b);
    console.log(backend+" : "+num);
    httpGet('http://149.248.20.246:'+backend+'/hc.php').then((d) => {
      if(d.indexOf('+') == 0) {
        console.log(num+" good");
        $('#hc-s'+num).css('background-color', 'lime');
      } else {
        console.log(num+" bad");
        $('#hc-s'+num).css('background-color', 'red');
      }
    }).catch(() => {
      console.log(num+" network error");
      $('#hc-s'+num).css('background-color', 'red');
    })
  }

  </script>
</html>
