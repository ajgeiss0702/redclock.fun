import {makeDate} from "$lib/countdown/countdown-utils.js";
import {create, get} from "$lib/settings";
import {browser, dev} from "$app/environment";

let serverSchool;
let serverSchedule;

export function copy(v) {
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

export function httpGet(url, callback = false) {
    if(!callback) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.text())
                .then(text => resolve(text))
                .catch(e => reject(e));
        })
    } else {
        fetch(url)
            .then(response => response.text())
            .then(text => callback(text));
    }
    /*if(!callback) {
        return new Promise((resolve, reject) => {
            let xmlhttp = new XMLHttpRequest();
            try {
                xmlhttp.onreadystatechange = function() {
                    if(xmlhttp.readyState === 4 && xmlhttp.responseText !== 24) {
                        console.debug("[httpGet] xmlhttp: %o", xmlhttp)
                        if(xmlhttp.status === 0) {
                            reject(new Error("Network error occured"))
                        }
                        resolve(xmlhttp.responseText);
                    }
                };
                xmlhttp.onerror = () => {
                    if(xmlhttp.readyState === 4) {
                        reject(new Error("Unknown error occured"));
                    }
                };
                xmlhttp.onabort = () => {
                    if(xmlhttp.readyState === 4) {
                        reject(new Error("Request aborted"));
                    }
                };
                xmlhttp.ontimeout = () => {
                    if(xmlhttp.readyState === 4) {
                        reject(new Error("Request timed out"));
                    }
                }
                xmlhttp.open("get", url, true);
                xmlhttp.send();
            } catch(e) {
                reject(e);
            }
        })
    } else {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState === 4 && xmlhttp.responseText !== 24) {
                callback(xmlhttp.responseText);
            } else if(xmlhttp.readyState === 4) {
                console.error("Failed to get '" + url + "'! ("+xmlhttp.readyState+")");
            }
        };
        xmlhttp.open("get", url, true);
        xmlhttp.send();
    }*/
}

export function _GET(parameterName) {
    let result = null,
        tmp = [];
    let items = location.search.substring(1).split("&");
    for (let index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

export function getSchoolCode() {
    if(typeof location === 'undefined' || typeof localStorage === 'undefined') {
        return serverSchool;
        //throw new Error("Cannot get school from SSR");
    }
    if(location.pathname === "/rmtv") {
        return "rmhs";
    }
    return localStorage.school
}

export function getScheduleCode() {
    if(typeof location === 'undefined' || typeof localStorage === 'undefined') {
        return serverSchedule;
        //throw new Error("Cannot get schedule from SSR");
    }
    if(location.pathname === "/rmtv") {
        return "rmtv";
    }
    return localStorage.schedule
}

if(browser) {
    (async () => {
        let sett = await import("$lib/settings.ts")
        sett.create("24hourTime", false, "24-hour time", "Display times in 24-hour format instead of 12-hour (AM/PM) format");
    })();
}

export function dateString(date = new Date()) {
    let d;

    if(Object.prototype.toString.call(date) === '[object Array]') {
        d = makeDate(date);
    } else if(date instanceof Date) {
        d = date;
    } else {
        d = new Date(date);
    }

    let ap = 'AM';
    let hour = d.getHours();
    let min = d.getMinutes();
    let sec = d.getSeconds();

    if(get("24hourTime")) {
        return hour+":"+min+":"+sec;
    }

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

export function setServerData(school, schedule) {
    serverSchool = school;
    serverSchedule = schedule;
}

export const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getAPIPrefix() {
    return dev ? "" : "https://ul.redclock.fun";
}

export const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

export function yesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
}

export function isSameDay(a, b) {
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
}