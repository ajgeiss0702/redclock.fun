import {getPeriodString, getTimeString, recalcCdd } from "$lib/countdown/countdown";
import { setServerData } from "$lib/utils.js";
import type {LoadEvent} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";
import {schoolExists, scheduleExists} from "$lib/countdown/countdown-utils";

export async function GET({params}: LoadEvent): Promise<Response> {
    if(!params.school || !await schoolExists(params.school)) {
        return json({message: "Invalid school"}, {status: 400});
    }
    if(!params.schedule || !await scheduleExists(params.school, params.schedule)) {
        return json({message: "Invalid schedule"}, {status: 400});
    }

    setServerData(params.school, params.schedule);
    await recalcCdd();
    let timeString = await getTimeString();
    let periodString = await getPeriodString();
    return json({timeString, periodString})
}