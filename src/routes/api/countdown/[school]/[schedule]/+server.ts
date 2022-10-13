import { getTimeString } from "$lib/countdown/countdown";
import { getSchoolCode, getScheduleCode, setServerData } from "$lib/utils.js";

export async function GET({params}): Promise<Response> {
    setServerData(params.school, params.schedule);
    return new Response(String(
        await getTimeString()
    ))
}