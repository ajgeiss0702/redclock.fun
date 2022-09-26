import {copy, httpGet} from "$lib/utils.js";

export function makeDate(raw) {
    let now = new Date();
    try {
        if(raw.length === 4) {
            return new Date(now.getFullYear(), now.getMonth(), now.getDate()+raw[0], raw[1], raw[2], raw[3], 0);
        } else {
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), raw[0], raw[1], raw[2], 0);
        }
    } catch (e) {
        console.trace("error " + e);
    }
}

let schedCache = {
    lastGet: 0
};

export async function getSchedules() {
    if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
    if((new Date().getTime() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
        return copy(schedCache.lastResp);
    }
}

export async function getSchedule() {
    if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
    if((new Date().getTime() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
        let keys = Object.keys(schedCache.lastResp.normal);
        return copy(schedCache.lastResp);
    }
    schedCache.lastGet = new Date().getTime();
    if(typeof localStorage.school == 'undefined') {
        schedCache.lastResp = false;
        console.debug("getSchedule() returning false!");
        return false;
    }
    if(await schoolExists(localStorage.school)) {
        let raw = await httpGet('https://ajg0702.us/api/rmf/schedule.php?school='+localStorage.school);
        let parsed = JSON.parse(raw)[localStorage.school];
        //console.debug("Got schedule from api ("+localStorage.school+"): %o", parsed);
        schedCache.lastResp = copy(parsed);
        return copy(parsed);
    } else {
        schedCache.lastResp = false;
        console.debug("getSchedule() returning false!");
        return false;
    }
}


export async function getCurrentSchedule() {
    return getScheduleFor(new Date());
}

export async function getScheduleFor(now, orig = true, doBreaks = true) {
    now = new Date(now);
    let schedule = await getSchedule();

    let specialDays = Object.keys(schedule.specials.day);
    let specialDates = Object.keys(schedule.specials.date);
    let offDates = Object.keys(schedule.off);

    let found = false;
    let foundSchedule;
    let skipTomorrow = false;

    // Off days (e.g. breaks)
    if(doBreaks) {
        for(let offDate in offDates) {
            if(offDates.hasOwnProperty(offDate)) {

                let mon0 = now.getMonth()+1;
                let day0 = now.getDate();
                let parts = offDates[offDate].split("-");

                let o = parts[0];
                let t = parts[1];

                let mon1 = Number(o.split("/")[0]);
                let day1 = Number(o.split("/")[1]);
                let mon2 = Number(t.split("/")[0]);
                let day2 = Number(t.split("/")[1]);

                if(mon0 >= mon1 && mon0 <= mon2) {
                    if(mon0 === mon1 && day0 < day1) {

                    } else if(mon0 === mon2 && day0 > day2) {

                    } else if(mon0 === mon2 && day0 === day2) {

                    } else {
                        found = true;
                        let endDate = new Date(now.getFullYear(), mon2-1, day2, 0, 0, 0, 0);
                        let end = await getScheduleFor(endDate, false, false);
                        let fin = {};

                        let k = (Object.keys(end)[0].replace(/tomorrow/g, "")) + " after "+schedule.off[offDates[offDate]]
                        let n = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))+1; // 1*60*60*24*1000
                        fin[k] = end[Object.keys(end)[0]];
                        fin[k][0] += n;

                        foundSchedule = copy(fin);
                        skipTomorrow = true;
                    }
                }

            }
        }
    }

    // Special dates (e.g. different schedule for a certain day)
    if(!found) {
        for (let date in specialDates) {
            if (specialDates.hasOwnProperty(date)) {
                let nowDate = now.getMonth() + 1 + "/" + (now.getDate());
                let parts = specialDates[date].split(',');

                for (let part in parts) {
                    if (parts.hasOwnProperty(part)) {
                        if(parts[part] === nowDate) {
                            found = true;
                            let spec = schedule.specials.date[specialDates[date]];
                            let schedule = Object.keys(spec).indexOf(localStorage.schedule) === -1 ? "*" : localStorage.schedule;
                            foundSchedule = spec[schedule];
                        }
                    }
                }
            }
        }
    }

    // Special days (e.g. wednesdays)
    if(!found) {
        for (let day in specialDays) {
            let nowDay = now.getDay();
            let parts = specialDays[day].split(',');
            for (let part in parts) {
                if (parts.hasOwnProperty(part)) {
                    if(parts[part].toString() === nowDay.toString()) {
                        found = true;
                        let spec = schedule.specials.day[specialDays[day]];
                        let schedule = Object.keys(spec).indexOf(localStorage.schedule) == -1 ? "*" : localStorage.schedule;
                        foundSchedule = spec[schedule];
                    }
                }
            }
        }
    }

    //If no special dates/days, return normal schedule
    if(found === false && typeof foundSchedule != 'object') {
        console.debug("[schedule] Using normal for day " +now.getDay());
        foundSchedule = schedule.normal[localStorage.schedule];
    }


    if(orig && !skipTomorrow) {
        let temp = new Date();
        temp.setDate(temp.getDate()+1);
        let tmr = copy(await getScheduleFor(temp, false));
        let tmrkeys = Object.keys(tmr);
        let tmrkeysl = tmrkeys.length;
        if(tmrkeysl > 0) {
            tmr[tmrkeys[0]][0] += 1;
            if(Object.keys(tmr).indexOf(tmrkeys[1]) !== -1) {
                tmr[tmrkeys[1]][0] += 1;
            }
            if(tmrkeys[0].indexOf("monday") !== -1 || tmrkeys[0].indexOf("after") !== -1) {
                foundSchedule[tmrkeys[0]] = tmr[tmrkeys[0]];
            } else {
                foundSchedule[tmrkeys[0]+" tomorrow"] = tmr[tmrkeys[0]];
            }

            if(typeof tmrkeys[1] != 'undefined') {
                if(tmrkeys[1].indexOf("monday") !== -1) {
                    foundSchedule[tmrkeys[1]] = tmr[tmrkeys[1]];
                } else {
                    foundSchedule[tmrkeys[1]+" tomorrow"] = tmr[tmrkeys[1]];
                }
            }
        }
    }

    if(orig) {
        for (let until in foundSchedule) {
            if (foundSchedule.hasOwnProperty(until)) {
                let data = foundSchedule[until];
                data[3] += await getOffset();
            }
        }
    }

    return foundSchedule;

}

export async function getOffset() {
    if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
    if((new Date().getTime() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
        return copy(schedCache.lastResp.offset)+ await getTZChange();
    }
    schedCache.lastGet = new Date().getTime();
    if(typeof localStorage.school == 'undefined') {
        schedCache.lastResp = false;
        console.debug("getOffset() returning false!");
        return false;
    }
    if(await schoolExists(localStorage.school)) {
        let raw = await httpGet('https://ajg0702.us/api/rmf/schedule.php?school='+localStorage.school);
        let parsed = JSON.parse(raw)[localStorage.school];
        schedCache.lastResp = copy(parsed);
        return copy(parsed).offset+ await getTZChange();
    } else {
        schedCache.lastResp = false;
        console.debug("getSchedule() returning false!");
        return false;
    }
}

async function getTZChange() {
    let tz = 420;
    if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
    if((new Date().getTime() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
        tz =  copy(schedCache.lastResp.tz);
    } else {
        schedCache.lastGet = new Date().getTime();
        if(typeof localStorage.school == 'undefined') {
            schedCache.lastResp = false;
            return -1;
        }
        if(await schoolExists(localStorage.school)) {
            let raw = await httpGet('https://ajg0702.us/api/rmf/schedule.php?school='+localStorage.school);
            let parsed = JSON.parse(raw)[localStorage.school];
            //console.debug("Got schedule from api ("+localStorage.school+"): %o", parsed);
            schedCache.lastResp = copy(parsed);
            tz =  copy(parsed).tz;
        } else {
            schedCache.lastResp = false;
            return -1;
        }
    }

    return (new Date().getTimezoneOffset()-tz)*-60;
}

export function schoolExists(key) {
    return new Promise((resolve, reject) => {
        httpGet('https://ajg0702.us/api/rmf/schedule.php?exists='+key).then((response) => {
            resolve(JSON.parse(response).exists);
        }).catch((e) => {
            reject(e);
        })
    })
}