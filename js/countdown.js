if((typeof rcf.school != 'string')) {
  location.href='#schoolselector';
}
console.debug("Loaded countdown script!")

async function updateScheduleTable(ele = '#schedule-table', date = new Date(), highlight = true) {
  var sched = await getScheduleFor(date);
  var ah = ``;
  for (var until in sched) {
    if (sched.hasOwnProperty(until)) {
      var time = makeDate(sched[until]);
      var special = "";
      if(highlight) {
        special = time.toString() == cd.cdd.toString() ? " class='current-target'" : "";
      }
      ah += `
      <tr`+special+`>
        <td>`+until+`</td><td>`+dateString(time)+`</td>
      </tr>
      `
    }
  }
  $(ele).html(`<div class='scroller'>
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


function updateDatePreview() {
  if($('#date-preview_date-select').val() == "") {
    $('#date-preview-table').text('Please enter a date above');
    return;
  }
  var d = new Date($('#date-preview_date-select').val());
  d.setDate(d.getDate()+1);
  updateScheduleTable('#date-preview-table', d, false)
}


rcf.on('load', () => {
  if(rcf.school == "rmhs") { // TODO: weather for other schools
    var weatherInterval;
    clearInterval(weatherInterval);
    weatherInterval = setInterval(updateWeather, 30000);
  } else {
    $('#weatherdiv').html("<small style='font-size: 5vh;'>Weather display for your school coming soon<sup>tm</sup></small>");
  }
})

async function init() {
  schedCache = {lastGet: 0}
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

settings.create('calibratedBox', true, "Show calibrated box", "Disabling this will not show the 'Countdown Calibrated!' box. The countdown will still be calibrated in the background.")
function calibrateCountdown() {
  var box = settings.get('calibratedBox');
  if(typeof cd.calibratedBefore != 'undefined') {
    if(box) {
      $('#calibration').text('Calibrating timer..');
      $('#calibration').removeClass('done');
      $('#calibration').removeClass('hidden');
      $('#calibration').removeClass('fadeOut');
      $('#calibration').addClass('fadeInFast');
    }
  } else {
    cd.calibratedBefore = true;
  }
  calibratingInterval = setInterval(() => {
    var ms = new Date().getMilliseconds();
    if(ms <= 50) {
      setCountdownInterval();
      if(box) {
        $('#calibration').text('Timer calibrated!');
        $('#calibration').removeClass('fadeInFast');
        $('#calibration').addClass('done');
      }
      setTimeout(() => {
        if(box) {
          $('#calibration').addClass('fadeOut');
        }
      }, 1.5e3)
    }
  }, 25);
}

setInterval(calibrateCountdown, 1800e3);

rcf.on('focus', () => {
  calibrateCountdown();
})

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
  'Mirrored',
  "Large"
]
function openLayoutMenu() {
  blur(closeLayoutMenu);
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
  $('#layouts').html(ah);
  $('#layout-selector')[0].style.display = 'block';
  $("body").scrollTop(0)
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


function openDatePreviewMenu() {
  blur(closeDatePreviewMenu);
  $('#date-preview')[0].style.display = 'block';
  $("body").scrollTop(0)
}
function closeDatePreviewMenu() {
  $('#date-preview').fadeOut();
  unblur();
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

var bluri = 0;
function blur(close) {
  document.getElementById('blur').style.filter = 'blur(2px)';
  if(typeof close == 'function') {
    var thisblur = copy(bluri)
    setTimeout(() => {
      $('#blur').on('click.themeclose', (e) => {
        close()
        $('#blur').off('click.themeclose');
      })
    }, 500)
  }
}

function unblur() {
  document.getElementById('blur').style.filter = '';
  $('#blur').off('click.themeclose');
}

$('#custom-background-file').change(() => {
  fileSelected();
})
$('#background-fill-screen').change(() => {
  updateCustomBackground()
})

async function fileSelected() {
  var files = $('#custom-background-file')[0].files;
  var result = await getBase64(files[0]);
  console.log(result);
  localStorage.customBackground = result;
  updateCustomBackground();
}

var cbFirst = true;
function updateCustomBackground() {
  if(cbFirst) {
    if(typeof localStorage.customBackgroundFill == 'string');
    $('#background-fill-screen')[0].checked = localStorage.customBackgroundFill == "true"
    cbFirst = false;
  }
  if(typeof localStorage.customBackground != 'undefined') {
    changeBackground(localStorage.customBackground);
    $('#removeBackground').html("<a onclick='localStorage.removeItem(\"customBackground\");updateCustomBackground()' class='btn btn-outline-danger'>Remove</a>")
  } else {
    $('#custom-background').css("background-image", "");
    $('#removeBackground').html('');
  }
  localStorage.customBackgroundFill = $('#background-fill-screen')[0].checked;
  if($('#background-fill-screen')[0].checked == true) {
    $('#custom-background').css("background-size", "cover");
  } else {
    $('#custom-background').css("background-size", "contain");
  }
}
function changeBackground(base64) {
  $('#custom-background').css("background-image", "url('"+base64+"')");
}

rcf.on('load', updateCustomBackground)
