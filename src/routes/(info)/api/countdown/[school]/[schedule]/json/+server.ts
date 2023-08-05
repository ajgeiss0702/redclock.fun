import type {RequestHandler} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";
import {schoolExists, scheduleExists} from "$lib/countdown/countdown-utils";
import {getDistance, getNextClass, getTimeString} from "$lib/countdown/countdown";

export const GET = (async ({params, locals}) => {
    const start = Date.now();
    const school = params.school;
    const schedule = params.schedule;

    if(!school || !await schoolExists(school)) {
        return json({message: "Invalid school"}, {status: 400});
    }
    if(!schedule || !await scheduleExists(school, schedule)) {
        return json({message: "Invalid schedule"}, {status: 400});
    }

    const {countdownDate, className} = await getNextClass(school, schedule);
    const distance = getDistance(countdownDate);
    const timeString = getTimeString(distance);

    locals.addTiming({
        id: "timeCalc",
        description: "Time Calculation",
        duration: Date.now() - start
    })

    return json({timeString, className})
}) satisfies RequestHandler