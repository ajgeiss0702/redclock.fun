import {copy} from "$lib/utils";
import {browser} from "$app/environment";

if(browser) {
    (async () => {
        let sett = await import("$lib/settings");
        sett.create('skipAHour', false, 'Skip A Hour', 'Will skip the countdown for A hour');
        sett.create("enableTzOffset", true, "Adjust timezone", "Should we adjust to always be on the school's timezone?");
    })();
}

export function makeDate(raw: number[]) {
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

let scheduleCache: {
    [key: string]: {
        lastGet: number,
        lastResp: Promise<SchoolData>
    }
} = {};

export function getSchedule(school: string, schedule: string): Promise<SchoolData | undefined> {
    let key = school + ":" + schedule;
    if((Date.now() - (scheduleCache[key]?.lastGet ?? 0)) < 300e3 && typeof scheduleCache[key]?.lastResp != "undefined") {
        return scheduleCache[key].lastResp;
    }

    if(!school) {
        if(browser) location.href = "/schools?reselect";
        return Promise.resolve(undefined);
    }
    if(!schedule) {
        if(browser) location.href = "/schedules?reselect";
        console.debug("falsy schedule code " + schedule)
        return Promise.resolve(undefined);
    }

    schoolExists(school)
        .then(e => {
            if(e) return;
            console.warn("School " + school + " does not exist!");
            if(!browser) return;

            location.href = "/schools?reselect";
        });

    scheduleCache[key] = {
        lastGet: Date.now(),
        lastResp: fetch('https://temp-schedules.redclock.fun/schedule.php?school='+school)
            .then(r => r.json())
            .then(j => j[school])
    };

    scheduleCache[key].lastResp.then((s) => {
        if(!s) return;
        // @ts-ignore
        if(schedule != "rmtv" && !s.schedules[schedule] && browser) {
            console.debug(schedule + " not in ", s);
            location.href = "/schedules?reselect"
        }
    })

    return scheduleCache[key].lastResp;
}


export async function getCurrentSchedule(school: string, schedule: string) {
    return getScheduleFor(school, schedule, new Date());
}

export async function getScheduleFor(schoolCode: string, scheduleCode: string, now: Date | string, orig = true, doBreaks = true): Promise<ClassTimes> {
    now = new Date(now);
    let schedule = copy(await getSchedule(schoolCode, scheduleCode));
    if(!schedule || !schedule.specials || !schedule.normal) {
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
                        let end = await getScheduleFor(schoolCode, scheduleCode, endDate, false, false);
                        let fin: ClassTimes = {};

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
                            let scheduleName = Object.keys(spec).indexOf(scheduleCode) === -1 ? "*" : scheduleCode;
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
                        let scheduleName = Object.keys(spec).indexOf(scheduleCode) === -1 ? "*" : scheduleCode;
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
        foundSchedule = schedule.normal[scheduleCode];
    }


    if(orig && !skipTomorrow) {
        let temp = new Date(now);
        temp.setDate(temp.getDate()+1);
        let tmr = copy(await getScheduleFor(schoolCode, scheduleCode, temp, false));
        let tomorrowKeys = Object.keys(tmr);
        if(tomorrowKeys.length > 0) {
            tmr[tomorrowKeys[0]][0] += 1;
            if(Object.keys(tmr).indexOf(tomorrowKeys[1]) !== -1) {
                tmr[tomorrowKeys[1]][0] += 1;
            }
            if(tomorrowKeys[0].indexOf("monday") !== -1 || tomorrowKeys[0].indexOf("after") !== -1) {
                foundSchedule[tomorrowKeys[0]] = tmr[tomorrowKeys[0]];
            } else {
                foundSchedule[tomorrowKeys[0]+" tomorrow"] = tmr[tomorrowKeys[0]];
            }

            if(typeof tomorrowKeys[1] != 'undefined') {
                if(tomorrowKeys[1].indexOf("monday") !== -1) {
                    foundSchedule[tomorrowKeys[1]] = tmr[tomorrowKeys[1]];
                } else {
                    foundSchedule[tomorrowKeys[1]+" tomorrow"] = tmr[tomorrowKeys[1]];
                }
            }
        }
    }

    if(orig) {
        for (let until in foundSchedule) {
            if (foundSchedule.hasOwnProperty(until)) {
                let data = foundSchedule[until];
                data[3] += await getOffset(schoolCode, scheduleCode);
            }
        }
    }

    return foundSchedule;

}

export async function getOffset(school: string, schedule: string) {
    return getSchedule(school, schedule)
        .then(async s => {
            if(s == undefined) return 0;
            return s.offset + await getTZChange(school, schedule);
        })
}

async function getTZChange(school: string, schedule: string): Promise<number> {
    let tz = (await getSchedule(school, schedule))?.tz || 420;

    return (new Date().getTimezoneOffset() - tz) * -60;
}

let existsCache: {[key: string]: Promise<boolean>} = {};
let existsExpiry: {[key: string]: number} = {};

export function schoolExists(key: string) {
    if(Object.keys(existsCache).includes(key) && Date.now() - existsExpiry[key] < 30 * 60e3) { // cache for 30 minutes
        return existsCache[key];
    }
    let promise = fetch('https://temp-schedules.redclock.fun/schedule.php?exists='+key)
        .then(r => r.json())
        .then(j => (j.exists as boolean));

    existsCache[key] = promise;
    existsExpiry[key] = Date.now();
    return promise;
}

export async function scheduleExists(school: string, schedule: string) {
    if(!await schoolExists(school)) return false;

    if(Object.keys(existsCache).includes(school+":"+schedule) && Date.now() - existsExpiry[school+":"+schedule] < 30 * 60e3) { // cache for 30 minutes
        return existsCache[school+":"+schedule];
    }
    let promise = fetch('https://temp-schedules.redclock.fun/schedule.php?school='+school)
        .then(r => r.json())
        .then(j => !!j[school]?.schedules?.[schedule]);

    existsCache[school+":"+schedule] = promise;
    existsExpiry[school+":"+schedule] = Date.now();
    return await promise;
}

export type SchoolData = {
    logo: string,
    display: string,
    offset: number,
    tz: number,
    schedules: {
        [key: string]: string
    },
    normal: ScheduleTimes,
    specials: {
        day: {
            [dayOfWeek: string]: ScheduleTimes
        },
        date: {
            [date: string]: ScheduleTimes
        }
    },
    off: {
        [dateRange: string]: string
    }
}

export type ClassTimes = {
    [period: string]: number[]
}

export type ScheduleTimes = {
    [schedule: string | "*"]: ClassTimes
}