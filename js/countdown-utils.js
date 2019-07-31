
var cd = {};

var lastGood = false;
async function getTimeString() {
  if(typeof cd.cdd != 'object') {
    lastGood = false;
    return undefined;
  }
  if(!lastGood) {
    updateScheduleTable();
  }
  lastGood = true;
  var distance = getTime();
  if(distance < 0) {
    return "<!--bell--><img src=\"/img/bell.svg\" style=\"height: 1em;\" class=\"bell-animation\">"
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
  updateScheduleTable();
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

  for (var until in foundsched) {
    if (foundsched.hasOwnProperty(until)) {
      var data = foundsched[until];
      data[3] += await getOffset();
    }
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

async function getOffset(override = false) {
  if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
  if((new Date().getTime() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
    var keys = Object.keys(schedCache.lastResp.normal);
    //console.debug("[getSchedule] Returned cached schedule ("+typeof schedCache.lastResp.normal[rcf.schedule]["A hour starts tomorrow"]+"): %o", schedCache.lastResp);
    return copy(schedCache.lastResp.offset);
  }
  schedCache.lastGet = new Date().getTime();
  if(typeof rcf.school == 'undefined') {
    cd.error = "No school."
    schedCache.lastResp = false;
    console.debug("getOffset() returning false!");
    return false;
  }
  if(await schoolExists(rcf.school)) {
    var raw = await httpGet('/api/schedule.php?school='+rcf.school);
    var parsed = JSON.parse(raw)[rcf.school];
    //console.debug("Got schedule from api ("+rcf.school+"): %o", parsed);
    schedCache.lastResp = copy(parsed);
    return copy(parsed).offset;
  } else {
    cd.error = "School does not exist."
    schedCache.lastResp = false;
    console.debug("getSchedule() returning false!");
    return false;
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