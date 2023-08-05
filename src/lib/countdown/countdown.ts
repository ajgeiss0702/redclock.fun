import {getCurrentSchedule, makeDate} from "$lib/countdown/countdown-utils";
import {get} from "$lib/settings";


export async function getNextClass(schoolCode: string, scheduleCode: string) {
    let countdownDate;
    console.debug('Getting next class!');
    let schedule = await getCurrentSchedule(schoolCode, scheduleCode);
    let scheduleKeys = Object.keys(schedule);
    countdownDate = makeDate(schedule[scheduleKeys[0]]);
    if(!countdownDate) throw Error("First countdownDate is falsy!")
    let i = 0;
    while(countdownDate.getTime() < new Date().getTime()) {
        i++;

        if(get('skipAHour') && scheduleKeys[i].includes("A hour starts")) {
            continue;
        }

        const possibleDate = makeDate(schedule[scheduleKeys[i]]);

        if(!possibleDate) continue;

        countdownDate = possibleDate;
        if(i > 1000) break;
    }
    return {
        countdownDate,
        className: scheduleKeys[i]
    }
}

export function getDistance(to: Date, now: Date = new Date()) {
    return to.getTime() - now.getTime();
}

export function getTimeString(distance: number) {
    if(distance < 0 || typeof distance == 'undefined') {
        return "bell";
    }
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let daysS = days > 0 ? days+"d " : "";
    let hoursS = hours > 0 ? hours+"h " : "";
    let minutesS = minutes > 0 ? minutes+"m " : "";
    let secondsS = seconds+"s ";
    if(typeof location !== 'undefined' && location.pathname === "/rmtv") {
        minutesS = minutes+" minute" + (minutes === 1 ? " " : "s ");
        secondsS = "";
    }
    return daysS+hoursS+minutesS+secondsS;
}