import type { PageServerLoad } from './$types';
import {getNormalSchedule, getScheduleNames} from "../../../../../lib/server/schoolSchedules";

export const load = (async ({locals, parent}) => {
    if(!locals.user) return {};

    const existing = await parent();

    return {
        schedule: await getNormalSchedule(existing.school.code),
        schedules: await getScheduleNames(existing.school.code)
    }


}) satisfies PageServerLoad;