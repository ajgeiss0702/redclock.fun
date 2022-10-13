import {makeDate} from "$lib/countdown/countdown-utils.js";

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

export function dateString(date = new Date()) {
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

export function setServerData(school, schedule) {
    serverSchool = school;
    serverSchedule = schedule;
}