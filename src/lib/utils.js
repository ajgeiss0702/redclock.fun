import {makeDate} from "$lib/countdown/countdown-utils.ts";
import {create, get} from "$lib/settings";
import {browser, dev, building as prerendering} from "$app/environment";

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

export function getSchoolCode() {
    if(typeof location === 'undefined' || typeof localStorage === 'undefined') {
        return serverSchool;
        //throw new Error("Cannot get school from SSR");
    }
    if(location.pathname === "/rmtv") {
        return "rmhs";
    }
    let searchParams = new URL(location.href).searchParams;
    if(searchParams.has("school")) return searchParams.get("school");
    return localStorage.school;
}

export function getScheduleCode() {
    if(typeof location === 'undefined' || typeof localStorage === 'undefined') {
        return serverSchedule;
        //throw new Error("Cannot get schedule from SSR");
    }
    if(location.pathname === "/rmtv") {
        return "rmtv";
    }
    let searchParams = new URL(location.href).searchParams;
    if(searchParams.has("schedule")) return searchParams.get("schedule");
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

export function getAPIPrefix(pre = true) {
    // if UL goes down, set second parameter to be empty aswell
    return (pre ? dev || prerendering : dev) ? "" : "https://ul.redclock.fun";
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
export function tomorrow(midnight = true) {
    const date = new Date();
    if(midnight) {
        date.setHours(0, 0, 0, 0);
    }
    date.setDate(date.getDate() + 1);
    return date;
}

export function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function isSameDay(a, b) {
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
}

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        console.debug("[getBase64] file: %o", file)
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    })
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

export function safeLength(a) {
    if(typeof a != 'object') {
        return 0;
    } else {
        return a.length;
    }
}

export function last30() {
    let date = new Date();
    let dates = [];
    for (let i = 0; i < 30; i++) {
        dates.push((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
        date.setDate(date.getDate()-1);
    }
    return dates.reverse();
}

export function twoDigits(n) {
    let s = String(n);
    if(n < 10 && n > -10) {
        s = "0" + s;
    }
    return s;
}


export function e(s) {
    return btoa(s);
}

export function h() {
    return new Date().getUTCHours();
}



// https://stackoverflow.com/a/36566052
function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}