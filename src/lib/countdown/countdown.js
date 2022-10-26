import {readable} from "svelte/store";
import {getCurrentSchedule, makeDate} from "$lib/countdown/countdown-utils.js";
import {create, get} from "$lib/settings.ts";
import {browser} from "$app/environment";

let setTimeString = () => {};
let setPeriodString = () => {};
let setCurrentTime = () => {};

export const timeString = readable("", s => {
    setTimeString = s;
})
export const periodString = readable("", s => {
    setPeriodString = p => {
        s(p);
        period = p;
    };
})
export const currentTime = readable(new Date(), s => {
    setCurrentTime = s;
})

let cdd;
let period;

let first = true;

let calibratingInterval;
export function calibrateCountdown() {
    if(!browser) return;
    if(first) {
        first = false;
        cdTick();
    }
    clearInterval(calibratingInterval);
    calibratingInterval = setInterval(() => {
        let ms = new Date().getMilliseconds();
        if(ms <= 50) {
            setCountdownInterval();
            clearInterval(calibratingInterval);
        }
    }, 25);
}

let calibrateInterval = browser ? setInterval(calibrateCountdown, 300e3) : false;
let mainCountdownInterval;

function setCountdownInterval() {
    if(!browser) return;
    clearInterval(mainCountdownInterval);
    mainCountdownInterval = setInterval(cdTick, 1e3);
}

export async function recalcCdd() {
    console.debug('recalc!');
    let schedule = await getCurrentSchedule();
    let scheduleKeys = Object.keys(schedule);
    cdd = makeDate(schedule[scheduleKeys[0]]);
    let i = 0;
    while(cdd.getTime() < new Date().getTime()) {
        i++;

        if(get('skipAHour') && scheduleKeys[i].indexOf("A hour starts") !== -1) {
            continue;
        }

        cdd = makeDate(schedule[scheduleKeys[i]]);
        if(i > 1000) break;
    }
    setPeriodString("until " + scheduleKeys[i]);
    cdTick();
}

export async function getTime() {
    if(typeof cdd === 'undefined') await recalcCdd();
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
    if(typeof document == 'undefined') return;
    if(timeString !== 'load' && timeString !== '' && timeString !== "bell" && typeof document !== 'undefined') {
        document.title = timeString + period + " - Red Clock";
    } else {
        document.title = " - Red Clock"
    }

    setCurrentTime(new Date());
}


export async function getTimeString() {
    if(typeof cdd === 'undefined') await recalcCdd();
    if(typeof cdd === 'undefined') return 'load';
    let distance = await getTime();
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
    if(typeof location !== 'undefined' && location.pathname === "/rmtv") {
        minutess = minutes+" minute" + (minutes === 1 ? " " : "s ");
        secondss = "";
    }
    return dayss+hourss+minutess+secondss;
}

export async function getCdd() {
    return cdd;
}