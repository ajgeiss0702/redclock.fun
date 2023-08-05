import {text} from "@sveltejs/kit";
import {getNextClass, getDistance, getTimeString} from "$lib/countdown/countdown";
import type { RequestHandler } from "./$types";
import {scheduleExists, schoolExists} from "$lib/countdown/countdown-utils";

export const GET = (async ({params, locals}) => {
    let start = Date.now();
    const school = params.school;
    const schedule = params.schedule;

    if(!school || !await schoolExists(school)) {
        return text("Invalid School", {status: 400});
    }
    if(!schedule || !await scheduleExists(school, schedule)) {
        return text("Invalid schedule", {status: 400});
    }

    const {countdownDate} = await getNextClass(school, schedule);
    const distance = getDistance(countdownDate);
    const timeString = getTimeString(distance);

    locals.addTiming({
        id: "timeCalc",
        description: "Time Calculation",
        duration: Date.now() - start
    })

    return text(timeString)
}) satisfies RequestHandler