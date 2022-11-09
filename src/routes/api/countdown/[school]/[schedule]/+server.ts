import { getTimeString, recalcCdd } from "$lib/countdown/countdown";
import { getSchoolCode, getScheduleCode, setServerData } from "$lib/utils.js";
import type {LoadEvent} from "@sveltejs/kit";

export async function GET({params}: LoadEvent): Promise<Response> {
    let start = Date.now();
    setServerData(params.school, params.schedule);
    await recalcCdd();
    let timeString = await getTimeString()
    return new Response(timeString, {
        headers: {
            "Server-Timing": "process;dur=" + (Date.now() - start)
        }
    })
}