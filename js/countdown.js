if((typeof rcf.school != 'string')) {
  location.href='#schoolselector';
}

rcf.on('load', function() {
  console.debug("[LOAD] localStorage.schedule "+localStorage.schedule+" type " +typeof localStorage.schedule)
  if(localStorage.schedule == "normal" || localStorage.schedule == null || localStorage.schedule == "0") {
    location.href='#scheduleselect';
  }
});
console.debug("Loaded countdown script! v2")

async function updateScheduleTable(ele = '#schedule-table', date = new Date(), highlight = true) {
  $("#tzDisplay").text("TZ: "+new Date().getTimezoneOffset()+"");
  var sched;
  try {
    sched = await getScheduleFor(date);
  } catch(e) {
    $(ele).text("An error occured.");
    console.error(e);
    return;
  }
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
          <th class='themecolor'>Hour</th>
          <th class='themecolor'>Time</th>
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
    if(typeof updateWeather == 'function') {
      weatherInterval = setInterval(updateWeather, 30000);
    }
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
    if(!rcf.desktop && rcf.schedule != "rmtv") {
      location.href="/reload.php?go=?reselect#scheduleselect";
    }
  }

  if(_GET("schedule") != null) {
    rcf.schedule = _GET("schedule");
  }

  initClock($("#analog-clock")[0]);
}
var countdownMainInterval;
var calibratingInterval;
rcf.on('load', () => {
  init();
  calibrateCountdown();
});

//settings.create('calibratedBox', true, "Show calibrated box", "Disabling this will not show the 'Countdown Calibrated!' box. The countdown will still be calibrated in the background.")
if(typeof settings == 'object') {
  settings.remove("calibratedBox");
}
function calibrateCountdown() {
  //var box = settings.get('calibratedBox');
  var box = false;
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

setInterval(calibrateCountdown, 300e3);

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


    if(!rcf.desktop) drawClock($("#analog-clock")[0]);


  }).catch((e) => {
    $('#countdown-text').text('');
    $('#countdown-period').text("An error occured: "+e);
    console.error(e);
  })
}


async function insertNews() {
  if($('#news-container').length > 0) {
    var news = await httpGet('https://astrophoenix.com/~aiden/api/rmf/news.html');
    news = news.replace('<script', '&ltscript');
    news = news.replace('</script', '&lt/script');

    news = news.replace('<link', '&ltlink');
    news = news.replace('</link', '&lt/link');

    $('#news-container').html(news);
    checkReadNews();
  }
}

async function checkReadNews() {
  var before = localStorage.lastReadNews || 0;
  var after = $('#news-container > div').length;
  var diff = after-before;
  if(diff != 0 && $('#sidebar-tab-news')[0].classList.value.indexOf("active") != -1) {
    // check if tab is already in focus. if it is, mark new news as already read.
    localStorage.lastReadNews = after;
    return;
  }
  if(diff != 0) {
    $('#newsnotif').html("<a class='badge badge-pill badge-danger' data-toggle='tab' href='#news-container'>"+diff+"</a>")
  } else {
    $('#newsnotif').html("");
  }
}

async function readNews() {
  localStorage.lastReadNews = $('#news-container > div').length;
  checkReadNews();
}

setInterval(insertNews, 300e3);


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
  "Large",
  "Countdown"
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

var datePreviewMenu = false;
function openDatePreviewMenu() {
  datePreviewMenu = true;
  blur(closeDatePreviewMenu);
  $('#date-preview')[0].style.display = 'block';
  $("body").scrollTop(0)
}
function closeDatePreviewMenu() {
  datePreviewMenu = false;
  $('#date-preview').fadeOut();
  unblur();
  $('#game').html('');
}
rcf.on('key-71', () => {
  if(datePreviewMenu) {
    $('#game').html(`
      <iframe src="pages/game.html" class='game-iframe'></iframe>
      `);
  }
})


if(getCookie('theme') != '') {
  rcf.changeTheme(getCookie('theme'));
}


rcf.on('load', () => {
  if(typeof $('#themeCheckBox')[0] == 'undefined') {
    return;
  }
  if(rcf.theme == 'dark' || rcf.theme == 'black') {
    $('#themeCheckBox')[0].checked = true;
    if(rcf.theme == 'black') {
      $('#darkCheckBox')[0].checked = true;
    }
  } else {
    $('#slide-blacktheme-checkbox')[0].style.height = "0em";
  }
})
function checkTheme() {
  if(typeof $('#themeCheckBox')[0] == 'undefined') {
    return;
  }
  if($('#themeCheckBox')[0].checked) {

    if($('#slide-blacktheme-checkbox')[0].style.height != '0em') {

      if($('#darkCheckBox')[0].checked) {
        rcf.changeTheme('black');
      } else {
        rcf.changeTheme('dark');
      }

    } else {
      $('#slide-blacktheme-checkbox')[0].style.height = "2em";
      rcf.changeTheme('dark');
      $('#darkCheckBox')[0].checked = false;
    }

  } else {
    $('#slide-blacktheme-checkbox')[0].style.height = "0em";
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

if(typeof $ != undefined) {
  $('#custom-background-file').change(() => {
    fileSelected();
  })
  $('#background-fill-screen').change(() => {
    updateCustomBackground()
  })
}

async function fileSelected() {
  var files = $('#custom-background-file')[0].files;
  var result = await getBase64(files[0]);
  console.log(result);
  localStorage.customBackground = result;
  updateCustomBackground();
}

var cbFirst = true;
function updateCustomBackground() {
  if(typeof $('#background-fill-screen')[0] == 'undefined') {
    return;
  }
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
