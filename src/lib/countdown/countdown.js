import {readable} from "svelte/store";
import {getCurrentSchedule, makeDate} from "$lib/countdown/countdown-utils.js";

let setTimeString = () => {};
let setPeriodString = () => {};

export const timeString = readable("", s => {
    setTimeString = s;
})
export const periodString = readable("", s => {
    setPeriodString = p => {
        s(p);
        period = p;
    };
})

let cdd;
let period;


let calibratingInterval;
export function calibrateCountdown() {
    clearInterval(calibratingInterval);
    calibratingInterval = setInterval(() => {
        let ms = new Date().getMilliseconds();
        if(ms <= 50) {
            setCountdownInterval();
            clearInterval(calibratingInterval);
        }
    }, 25);
}

let calibrateInterval = setInterval(calibrateCountdown, 300e3);
let mainCountdownInterval;

function setCountdownInterval() {
    clearInterval(mainCountdownInterval);
    recalcCdd();
    mainCountdownInterval = setInterval(cdTick, 1e3);
}

async function recalcCdd() {
    if(typeof localStorage === 'undefined') return;
    console.debug('recalc!');
    let schedule = await getCurrentSchedule();
    let scheduleKeys = Object.keys(schedule);
    cdd = makeDate(schedule[scheduleKeys[0]]);
    let i = 0;
    while(cdd.getTime() < new Date().getTime()) {
        i++;
        /* if(typeof settings == 'object') { TODO: settings: skip A hour setting
            if(settings.get('skipAHour') && scheduleKeys[i].indexOf("A hour starts") !== -1) {
                continue;
            }
        } */

        cdd = makeDate(schedule[scheduleKeys[i]]);
        if(i > 1000) break;
    }
    setPeriodString("until " + scheduleKeys[i]);
    cdTick();
}

export function getTime() {
    if(typeof cdd === 'undefined') return -1;
    let distance = cdd.getTime() - new Date().getTime();
    if(distance <= (-5000)) {
        cdd = undefined;
        recalcCdd();
        return undefined;
    }
    return distance;
}


async function cdTick() {
    let timeString = await getTimeString();
    setTimeString(timeString);
    if(timeString !== '' && timeString !== "bell" && typeof document !== 'undefined') {
        document.title = timeString + period + " - Red Clock";
    }
}


async function getTimeString() {
    if(typeof cdd === 'undefined') return "load";
    let distance = getTime();
    if(distance < 0 || typeof distance == 'undefined') {
        return "bell";
    }
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let dayss = days > 0 ? days+"d " : "";
    let hourss = hours > 0 ? hours+"h " : "";
    let minutess = minutes > 0 ? minutes+"m " : "";
    let secondss = seconds+"s ";
    if(location.pathname === "/rmtv") {
        minutess = minutes+" minute" + (minutes === 1 ? " " : "s ");
        secondss = "";
    }
    return dayss+hourss+minutess+secondss;
}
