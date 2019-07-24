var cd = {};

console.debug("Loaded countdown script!")

var lastGood = false;
async function getTimeString() {
  if(typeof cd.cdd != 'object') {
    setTimeout(() => {
      tick()
    }, 500);
    lastGood = false;
    $('#countdown-period').text("Finding next bell..")
    return undefined;
  }
  if(!lastGood) {
    updateScheduleTable();
  }
  var distance = getTime();
  if(distance < 0) {
    return "<img src=\"/img/bell.svg\" style=\"height: 1em;\" class=\"bell-animation\">"
  }
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var dayss = days > 0 ? days+"d " : "";
  var hourss = hours > 0 ? hours+"h " : "";
  var minutess = minutes > 0 ? minutes+"m " : "";
  var secondss = seconds+"s ";
  return dayss+hourss+minutess+secondss;
}

function getTime() {
  var distance = cd.cdd.getTime() - new Date().getTime();
  if(distance <= (-2500)) {
    recalcCdd();
  }
  return distance;
}

async function updateScheduleTable() {
  // TODO: schedule table
}

async function recalcCdd() {
  var sched = await getCurrentSchedule();
  var skeys = Object.keys(sched);
  cd.cdd = makeDate(sched[skeys[0]]);
  cd.i = 0;
  while(cd.cdd.getTime() < new Date().getTime()) {
    cd.i++;
    cd.cdd = makeDate(sched[skeys[cd.i]]);
  }
  cd.period = skeys[cd.i];
}

function makeDate(raw, ahead_debug = false) {
  if(ahead_debug) {
    var now = new Date();
    cd.cdd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()+3,
      now.getMilliseconds()
    );
    return;
  }
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()+raw[0], raw[1], raw[2], raw[3], 0);
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
    //console.debug($('#countdown-text').html() + "\n" + s)
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

async function getCurrentSchedule() {
  return getScheduleFor(new Date());
}

async function getScheduleFor(now, orig = true) {
  now = new Date(now);
  var sched = await getSchedule();

  var specialdays = Object.keys(sched.specials.day);
  var specialdates = Object.keys(sched.specials.date);

  var found = false;
  var foundsched;

  for (var date in specialdates) {
    if (specialdates.hasOwnProperty(date)) {
      var nowdate = now.getMonth()+1+"/"+now.getDate();
      var parts = date.split(',');
      for (var part in parts) {
        if (parts.hasOwnProperty(part)) {
          if(part == nowdate) {
            found = true;
            foundsched = sched.specials.date[date][rcf.schedule]
          }
        }
      }
    }
  }


  for (var day in specialdays) {
    if (specialdays.hasOwnProperty(day)) {
      var nowday = now.getDay()+1;
      var parts = day.split(',');
      for (var part in parts) {
        if (parts.hasOwnProperty(part)) {
          if(part == nowday) {
            found = true;
            foundsched = sched.specials.day[day][rcf.schedule];
          }
        }
      }
    }
  }

  //If no special dates/days, return normal schedule
  if(!found) {
    foundsched = sched.normal[rcf.schedule]
  }

  if(orig) {
    var temp = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()+1,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    )
    tmr = undefined;
    var tmr = await getScheduleFor(temp, false);
    tmr = copy(tmr);
    var tmrkeys = Object.keys(tmr);
    var tmrkeysl = tmrkeys.length;
    tmr[tmrkeys[0]][0] = 1;
    tmr[tmrkeys[1]][0] = 1;
    foundsched[tmrkeys[0]+" tomorrow"] = tmr[tmrkeys[0]];
    foundsched[tmrkeys[1]+" tomorrow"] = tmr[tmrkeys[1]];
  }

  return foundsched;

}


var schedCache = {
  lastGet: 0
};

async function getSchedule(override = false) {
  if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
  if((new Date().getTime() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
    var keys = Object.keys(schedCache.lastResp.normal);
    //console.debug("[getSchedule] Returned cached schedule ("+typeof schedCache.lastResp.normal[rcf.schedule]["A hour starts tomorrow"]+"): %o", schedCache.lastResp);
    return copy(schedCache.lastResp);
  }
  schedCache.lastGet = new Date().getTime();
  if(typeof rcf.school == 'undefined') {
    cd.error = "No school."
    schedCache.lastResp = false;
    console.debug("getSchedule() returning false!");
    return false;
  }
  if(await schoolExists(rcf.school)) {
    var raw = await httpGet('/api/schedule.php?school='+rcf.school);
    var parsed = JSON.parse(raw)[rcf.school];
    //console.debug("Got schedule from api ("+rcf.school+"): %o", parsed);
    schedCache.lastResp = copy(parsed);
    return copy(parsed);
  } else {
    cd.error = "School does not exist."
    schedCache.lastResp = false;
    console.debug("getSchedule() returning false!");
    return false;
  }
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


function dateString(date = new Date()) {
  var d;

  if(Object.prototype.toString.call(date) === '[object Array]') {
    d = makeDate(date);
  } else if(date instanceof Date) {
    d = date;
  } else {
    d = new Date(date);
  }

  var ap = 'AM';
  var hour = d.getHours();
  var min = d.getMinutes();
  var sec = d.getSeconds();

  if(hour > 12) {
    ap = 'PM';
    hour = hour - 12;
  }
  if(min < 10) {
    min = "0"+min
  }
  if(sec < 10) {
    sec = "0"+sec
  }

  return hour+":"+min+":"+sec+" "+ap;


}