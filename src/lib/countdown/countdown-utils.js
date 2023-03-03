import {copy, getScheduleCode, getSchoolCode, httpGet} from "$lib/utils.js";
import {browser} from "$app/environment";
import {goto} from "$app/navigation";

if(browser) {
    (async () => {
        let sett = await import("$lib/settings.ts");
        sett.create('skipAHour', false, 'Skip A Hour', 'Will skip the countdown for A hour');
        sett.create("enableTzOffset", true, "Adjust timezone", "Should we adjust to always be on the school's timezone?");
    })();
}

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

export function getSchedule() {
    if(typeof schedCache == 'undefined') schedCache = {lastGet:0}
    if((Date.now() - schedCache.lastGet) < 300e3 && typeof schedCache.lastResp != "undefined") {
        return schedCache.lastResp;
    }
    schoolExists(getSchoolCode())
        .then(e => {
            if(e) return;
            console.warn("School " + getSchoolCode() + " does not exist!");
            if(!browser) return;

            location.href = "/schools?reselect";
        });
    schedCache.lastGet = Date.now();
    schedCache.lastResp = fetch('https://ajg0702.us/api/rmf/schedule.php?school='+getSchoolCode())
        .then(r => r.json())
        .then(j => j[getSchoolCode()]);
    return schedCache.lastResp;
}


export async function getCurrentSchedule() {
    return getScheduleFor(new Date());
}

export async function getScheduleFor(now, orig = true, doBreaks = true) {
    now = new Date(now);
    let schedule = await getSchedule();
    if(!schedule.specials || !schedule.normal) {
        return {};
    }

    let specialDays = typeof schedule.specials !== "undefined" ? Object.keys(schedule.specials.day) : [];
    let specialDates = typeof schedule.specials !== "undefined" ? Object.keys(schedule.specials.date) : [];
    let offDates = typeof schedule.specials !== "undefined" ? Object.keys(schedule.off) : [];

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
                            let scheduleName = Object.keys(spec).indexOf(getScheduleCode()) === -1 ? "*" : getScheduleCode();
                            foundSchedule = spec[scheduleName];
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
                    if(parts[part] === nowDay.toString()) {
                        found = true;

                        let spec = schedule.specials.day[specialDays[day]];
                        let scheduleName = Object.keys(spec).indexOf(getScheduleCode()) === -1 ? "*" : getScheduleCode();
                        foundSchedule = spec[scheduleName];
                        break;
                    }
                }
            }
            if(found) break;
        }
    }

    //If no special dates/days, return normal schedule
    if(found === false && typeof foundSchedule != 'object') {
        console.debug("[schedule] Using normal for day " +now.getDay());
        foundSchedule = schedule.normal[getScheduleCode()];
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

export function getOffset() {
    return getSchedule()
        .then(async s => s.offset + await getTZChange())
}

async function getTZChange() {
    let tz = (await getSchedule()).tz;

    return (new Date().getTimezoneOffset() - tz) * -60;
}


export function schoolExists(key) {
    if(window) {
        if(typeof window.existsCache === "undefined") window.existsCache = {};
        if(typeof window.existsExpiry === "undefined") window.existsExpiry = {};
        if(Object.keys(window.existsCache).includes(key) && Date.now() - window.existsExpiry[key] < 30 * 60e3) { // cache for 30 minutes
            return window.existsCache[key];
        }
    }
    let promise = fetch('https://ajg0702.us/api/rmf/schedule.php?exists='+key, {
        cache: "default"
    })
        .then(r => r.json())
        .then(j => j.exists);

    if(window) {
        window.existsCache[key] = promise;
        window.existsExpiry[key] = Date.now();
    }
    return promise;
}