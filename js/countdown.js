
console.debug("Loaded countdown script!")

function getTime() {
  var distance = cd.cdd.getTime() - new Date().getTime();
  if(distance <= (-2500)) {
    recalcCdd();
  }
  return distance;
}

async function updateScheduleTable() {
  var sched = await getCurrentSchedule();
  var ah = ``;
  for (var until in sched) {
    if (sched.hasOwnProperty(until)) {
      var time = makeDate(sched[until]);
      var special = time.toString() == cd.cdd.toString() ? " class='current-target'" : "";
      ah += `
      <tr`+special+`>
        <td>`+until+`</td><td>`+dateString(time)+`</td>
      </tr>
      `
    }
  }
  $('#schedule-table').html(`<div class='scroller'>
    <table class="table table-striped">
      <thead>
        <tr>
          <th class='themecolor'>Time</th>
          <th class='themecolor'>Hour</th>
        </tr>
      </thead>
      <tbody>`+
      ah+
      `</tbody>
    </table>
  </div>
  `);
}





rcf.on('load', () => {
  if(rcf.school == "rmhs") { // TODO: weather for other schools
    var weatherInterval;
    clearInterval(weatherInterval);
    weatherInterval = setInterval(updateWeather, 30000);
  } else {
    $('#weatherdiv').html("Weather display for your school coming soon<sup>tm</sup>")
  }
})

async function init() {
  $('#countdown-period').text('Loading times..');
  var sched = (await getSchedule());
  if(!sched) {
    await delay(500);
    sched = (await getSchedule());
  }
  sched = sched.normal;
  var schedules = Object.keys(sched);
  cd.scheduleList = schedules;
  if(schedules.indexOf(rcf.schedule) == -1 || typeof rcf.schedule != 'string' || rcf.schedule+"" == "null") {
    rcf.schedule = schedules[0];
  }
}
var countdownMainInterval;
var calibratingInterval;
rcf.on('load', () => {
  init();
  calibrateCountdown();
});

function calibrateCountdown() {
  if(typeof cd.calibratedBefore != 'undefined') {
    $('#calibration').text('Calibrating timer..');
    $('#calibration').removeClass('done');
    $('#calibration').removeClass('hidden');
    $('#calibration').removeClass('fadeOut');
    $('#calibration').addClass('fadeInFast');
  } else {
    cd.calibratedBefore = true;
  }
  calibratingInterval = setInterval(() => {
    var ms = new Date().getMilliseconds();
    if(ms <= 50) {
      setCountdownInterval();
      $('#calibration').text('Timer calibrated!');
      $('#calibration').removeClass('fadeInFast');
      $('#calibration').addClass('done');
      setTimeout(() => {
        $('#calibration').addClass('fadeOut');
      }, 1.5e3)
    }
  }, 25);
}

setInterval(calibrateCountdown, 600e3);

function setCountdownInterval() {
  clearInterval(calibratingInterval);
  clearInterval(countdownMainInterval);
  recalcCdd();
  countdownMainInterval = setInterval(tick, 1e3);
  tick();
}

var titletext;
var ticki = 0;
function tick() {
  getTimeString().then((s) => {
    if(typeof s == undefined) {
      $('#countdown-period').text("Preparing countdown");
      return;
    }
    if(s != $('#countdown-text').html()) {
      $('#countdown-text').html(s);
    }
    var period = cd.period;
    if(period+"" == "undefined") {
      period = undefined;
    } else {
      period = "until " + cd.period;
    }
    $('#countdown-period').text(period);
    titletext = s + period;
    if(typeof titletext == 'string') {
      if(titletext.indexOf('<img') != -1) {
        titletext = "Bell is ringing!"
      }
    } else {
      titletext = "Loading countdown.."
    }
    document.title = titletext + " - Red Clock";

    $('#exact-time').text(dateString());
    ticki++;
    if(ticki > 15) {
      slowTick();
      ticki = 0;
    }

  }).catch((e) => {
    $('#countdown-text').text('');
    $('#countdown-period').text("An error occured: "+e);
    console.error(e);
  })
}


async function slowTick() {
  updateScheduleTable();
}

function copy(v) {
  switch (typeof v) {
    case 'object':
      return JSON.parse(JSON.stringify(v));
    case 'string':
      return new String(v).toString();
    case 'number':
      return Number(new Number(v));
    default:
      var tmp = [v];
      return JSON.parse(JSON.stringify(tmp))[0];
  }
}


var layouts = [
  'Default',
  'Mirrored'
]
function openLayoutMenu() {
  $('#layout-selector').fadeIn();
  blur();
  var ah = "";
  for (layout of layouts) {
    ah += `
    <div class="layout card" style="width: 25vw;" onclick='changeLayout("`+layout+`")'>
      <iframe src='/?layout=`+layout.toLowerCase()+`' class='layout-iframe card-img-top'></iframe>
      <div class="card-body">
        <p class="card-text">`+layout+`</p>
      </div>
    </div>`
  }
  $('#layouts').html(ah)
}

function changeLayout(layout) {
  setCookie('layout', layout.toLowerCase());
  $('#layout-changer')[0].href = '/css/layouts/'+layout.toLowerCase()+'.css';
}

function closeLayoutMenu() {
  $('#layout-selector').fadeOut();
  unblur();
  $('#layouts').html('');
}

rcf.theme = 'light';
rcf.changeTheme = (theme) => {
  $('#theme-changer')[0].href = '/css/themes/'+theme.toLowerCase()+'.css';
  rcf.theme = theme;
  setCookie('theme', theme)
  updateWeather();
}
if(getCookie('theme') != '') {
  rcf.changeTheme(getCookie('theme'));
}


rcf.on('load', () => {
  if(rcf.theme == 'dark') {
    $('#themeCheckBox')[0].checked = true;
  }
})
function checkTheme() {
  if($('#themeCheckBox')[0].checked) {
    rcf.changeTheme('dark');
  } else {
    rcf.changeTheme('light');
  }
}

function blur() {
  document.getElementById('blur').style.filter = 'blur(2px)';
}

function unblur() {
  document.getElementById('blur').style.filter = 'blur(0)';
}