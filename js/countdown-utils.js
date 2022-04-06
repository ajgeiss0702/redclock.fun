var cd = {offset:0};


function getTime() {
  var distance = cd.cdd.getTime() - new Date().getTime();
  if(distance <= (-5000)) {
    cd.cdd = undefined;
    recalcCdd();
    return undefined;
  }
  return distance;
}

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
  if(distance < 0 || typeof distance == 'undefined') {
    var sl = (rcf.desktop) ? "./" : "/"
    return "<!--bell--><img src=\""+sl+"img/bell.svg\" style=\"height: 1em;\" class=\"bell-animation\">"
  }
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var dayss = days > 0 ? days+"d " : "";
  var hourss = hours > 0 ? hours+"h " : "";
  var minutess = minutes > 0 ? minutes+"m " : "";
  var secondss = seconds+"s ";
  if(_GET("rmtv") == "undefined") {
    var minutess = minutes+" minute" + (minutes == 1 ? " " : "s ");
    secondss = "";
  }
  return dayss+hourss+minutess+secondss;
}


if(typeof settings == 'object') {
  settings.create('skipAHour', false, 'Skip A Hour', 'Will skip the countdown for A hour');
} else if(typeof rcf == 'object') {
  rcf.on('load', () => {
    settings.create('skipAHour', false, 'Skip A Hour', 'Will skip the countdown for A hour');
  })
} else {
  console.warn("No settings! " + typeof settings + " " + typeof rcf)
}
var shutup = false;
async function recalcCdd() {
  if(shutup) {
    console.trace();
  }
  console.debug('recalc!');
  var sched = await getCurrentSchedule();
  var skeys = Object.keys(sched);
  cd.cdd = makeDate(sched[skeys[0]]);
  cd.i = 0;
  var i = 0;
  while(cd.cdd.getTime() < new Date().getTime()) {
    cd.i++;
    if(typeof settings == 'object') {
      if(settings.get('skipAHour') && skeys[cd.i].indexOf("A hour starts") != -1) {
        continue;
      }
    }
    //console.log(sched[skeys[cd.i]]);
    cd.cdd = makeDate(sched[skeys[cd.i]]);
    i++;
    if(i > 1000) break;
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
  try {
    if(raw.length == 4) {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()+raw[0], raw[1], raw[2], raw[3], 0);
    } else {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), raw[0], raw[1], raw[2], 0);
    }
  } catch (e) {
    console.trace("error "+e);
  }
}

async function getCurrentSchedule() {
  return getScheduleFor(new Date());
}

async function getScheduleFor(now, orig = true, doBreaks = true) {
  now = new Date(now);
  var sched = await getSchedule();

  var specialdays = Object.keys(sched.specials.day);
  var specialdates = Object.keys(sched.specials.date);
  var offdates = Object.keys(sched.off);

  var found = false;
  var foundsched;
  var skipTomorrow = false;

  // Off days (e.g. breaks)
  if(doBreaks) {
    for(var offd in offdates) {
      if(offdates.hasOwnProperty(offd)) {

        var mon0 = now.getMonth()+1;
        var day0 = now.getDate();
        var parts = offdates[offd].split("-");

        var o = parts[0];
        var t = parts[1];

        var mon1 = Number(o.split("/")[0]);
        var day1 = Number(o.split("/")[1]);
        var mon2 = Number(t.split("/")[0]);
        var day2 = Number(t.split("/")[1]);

        if(mon0 >= mon1 && mon0 <= mon2) {
          if(mon0 == mon1 && day0 < day1) {
            continue;
          } else if(mon0 == mon2 && day0 > day2) {
            continue;
          } else if(mon0 == mon2 && day0 == day2) {
            continue;
          } else {
            found = true;
            var enddate = new Date(now.getFullYear(), mon2-1, day2, 0, 0, 0, 0);
            var end = await getScheduleFor(enddate, false, false);
            var fin = {};

            var k = (Object.keys(end)[0].replace(/tomorrow/g, ""))+" after "+sched.off[offdates[offd]]
            var n = Math.floor((enddate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))+1; // 1*60*60*24*1000
            fin[k] = end[Object.keys(end)[0]];
            fin[k][0] += n;

            foundsched = copy(fin);
            skipTomorrow = true;
          }
        }

      }
    }
  }

 // Special dates (e.g. different schedule for a certain day)
  if(!found) {
    for (var date in specialdates) {
      if (specialdates.hasOwnProperty(date)) {
        var nowdate = now.getMonth()+1+"/"+(now.getDate());
        var parts = specialdates[date].split(',');
        //console.log(date);
        for (var part in parts) {
          if (parts.hasOwnProperty(part)) {
            //console.debug(parts[part]+" / "+nowdate);
            if(parts[part] == nowdate) {
              //console.debug("^-----------------------------------------------")
              found = true;
              var spec = sched.specials.date[specialdates[date]];
              var sched = Object.keys(spec).indexOf(rcf.schedule) == -1 ? "*" : rcf.schedule;
              foundsched = spec[sched];
            }
          }
        }
      }
    }
  }

  // Special days (e.g. wednesdays)
  if(!found) {
    for (var day in specialdays) {
      var nowday = now.getDay();
      var parts = specialdays[day].split(',');
      for (var part in parts) {
        if (parts.hasOwnProperty(part)) {
          if(typeof specialdebug != 'undefined') {
            //console.debug(nowday + " : " + parts[part] + " / " + part + " : " + specialdays[day] + "["+day+"]");
          }
          if(parts[part].toString() == nowday.toString()) {
            found = true;
            //foundsched = sched.specials.day[specialdays[day]][rcf.schedule];
            var spec = sched.specials.day[specialdays[day]];
            var sched = Object.keys(spec).indexOf(rcf.schedule) == -1 ? "*" : rcf.schedule;
            foundsched = spec[sched];
          }
        }
      }
    }
  }

  //If no special dates/days, return normal schedule
  if(found == false && typeof foundsched != 'object') {
    console.debug("[schedule] Using normal for day " +now.getDay());
    foundsched = sched.normal[rcf.schedule];
  }


  if(orig && !skipTomorrow) {
    var temp = new Date();
    temp.setDate(temp.getDate()+1);
    tmr = undefined;
    var tmr = copy(await getScheduleFor(temp, false));
    var tmrkeys = Object.keys(tmr);
    var tmrkeysl = tmrkeys.length;
    if(tmrkeysl > 0) {
      tmr[tmrkeys[0]][0] += 1//tmr[tmrkeys[0]][0]+1;
      if(Object.keys(tmr).indexOf(tmrkeys[1]) != -1) {
        tmr[tmrkeys[1]][0] += 1//tmr[tmrkeys[0]][0]+1;
      }
      if(tmrkeys[0].indexOf("monday") != -1 || tmrkeys[0].indexOf("after") != -1) {
        foundsched[tmrkeys[0]] = tmr[tmrkeys[0]];
      } else {
        foundsched[tmrkeys[0]+" tomorrow"] = tmr[tmrkeys[0]];
      }

      if(typeof tmrkeys[1] != 'undefined') {
        if(tmrkeys[1].indexOf("monday") != -1) {
          foundsched[tmrkeys[1]] = tmr[tmrkeys[1]];
        } else {
          foundsched[tmrkeys[1]+" tomorrow"] = tmr[tmrkeys[1]];
        }
      }
    }
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

var fileAdd = "";
if(location.origin.indexOf("file://") != -1) {
  fileAdd = "https://redclock.fun";
}

async function getSchedules() {
  if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
  if((new Date().getTime() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
    var keys = Object.keys(schedCache.lastResp.normal);
    //console.debug("[getSchedule] Returned cached schedule ("+typeof schedCache.lastResp.normal[rcf.schedule]["A hour starts tomorrow"]+"): %o", schedCache.lastResp);
    return copy(schedCache.lastResp);
  }
}

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
    var raw = await httpGet(fileAdd+'/api/schedule.php?school='+rcf.school);
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
    //var keys = Object.keys(schedCache.lastResp.normal);
    //console.debug("[getSchedule] Returned cached schedule ("+typeof schedCache.lastResp.normal[rcf.schedule]["A hour starts tomorrow"]+"): %o", schedCache.lastResp);
    cd.offset = copy(schedCache.lastResp.offset);
    return copy(schedCache.lastResp.offset)+ await getTZChange();
  }
  schedCache.lastGet = new Date().getTime();
  if(typeof rcf.school == 'undefined') {
    cd.error = "No school."
    schedCache.lastResp = false;
    console.debug("getOffset() returning false!");
    return false;
  }
  if(await schoolExists(rcf.school)) {
    var raw = await httpGet(fileAdd+'/api/schedule.php?school='+rcf.school);
    var parsed = JSON.parse(raw)[rcf.school];
    //console.debug("Got schedule from api ("+rcf.school+"): %o", parsed);
    schedCache.lastResp = copy(parsed);
    return copy(parsed).offset+ await getTZChange();
  } else {
    cd.error = "School does not exist."
    schedCache.lastResp = false;
    console.debug("getSchedule() returning false!");
    return false;
  }
}

if(typeof settings == 'object') {
  settings.create("enableTzOffset", true, "Adjust timezone", "Should we adjust to always be on the school's timezone?");
}
async function getTZChange() {
  if(typeof settings == 'object') {
    if(!settings.get("enableTzOffset")) return 0;
  }
  var tz = 420;
  if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
  if((new Date().getTime() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
    //var keys = Object.keys(schedCache.lastResp.normal);
    //console.debug("[getSchedule] Returned cached schedule ("+typeof schedCache.lastResp.normal[rcf.schedule]["A hour starts tomorrow"]+"): %o", schedCache.lastResp);
    cd.offset = copy(schedCache.lastResp.offset);
    tz =  copy(schedCache.lastResp.tz);
  } else {
    schedCache.lastGet = new Date().getTime();
    if(typeof rcf.school == 'undefined') {
      cd.error = "No school."
      schedCache.lastResp = false;
      return -1;
    }
    if(await schoolExists(rcf.school)) {
      var raw = await httpGet(fileAdd+'/api/schedule.php?school='+rcf.school);
      var parsed = JSON.parse(raw)[rcf.school];
      //console.debug("Got schedule from api ("+rcf.school+"): %o", parsed);
      schedCache.lastResp = copy(parsed);
      tz =  copy(parsed).tz;
    } else {
      cd.error = "School does not exist."
      schedCache.lastResp = false;
      return -1;
    }
  }

  return (new Date().getTimezoneOffset()-tz)*-60;
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

  if(hour >= 12) {
    ap = 'PM';
    if(hour > 12) {
      hour = hour - 12;
    }
  }
  if(min < 10) {
    min = "0"+min
  }
  if(sec < 10) {
    sec = "0"+sec
  }

  return hour+":"+min+":"+sec+" "+ap;
}

function schoolExists(key) {
  return new Promise((resolve, reject) => {
    httpGet(fileAdd+'/api/schedule.php?exists='+key).then((response) => {
      resolve(JSON.parse(response).exists);
    }).catch((e) => {
      reject(e);
    })
  })
}
