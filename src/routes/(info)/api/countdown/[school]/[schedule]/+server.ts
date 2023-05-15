import { getTimeString, recalcCdd } from "$lib/countdown/countdown";
import { setServerData } from "$lib/utils.js";
import type {RequestHandler} from "@sveltejs/kit";
import {text} from "@sveltejs/kit";

export const GET = (async ({params, locals}) => {
    let start = Date.now();
    setServerData(params.school, params.schedule);
    await recalcCdd();
    let timeString = await getTimeString()

    locals.addTiming({
        id: "timeCalc",
        description: "Time Calculation",
        duration: Date.now() - start
    })

    return text(timeString)
}) satisfies RequestHandler