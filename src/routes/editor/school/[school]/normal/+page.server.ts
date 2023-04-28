import type { PageServerLoad } from './$types';
import {getNormalSchedule, getScheduleNames} from "$lib/server/schoolSchedules";
import { devSchedule, devSchedules } from '$lib/server/devData';
import {dev} from "$app/environment";
import {error} from "@sveltejs/kit";

export const load = (async ({locals, parent, platform, params}) => {
    if(!locals.user) return {};

    const existing = await parent();

    const schools = platform?.env?.SCHOOLS;
    if(!schools && dev) {
        return {
            schedule: devSchedule,
            schedules: devSchedules
        }
    } else if(!schools) {
        throw error(500, "No school store!")
    }

    const {value, metadata} = await schools.getWithMetadata(params.school, {type: "json"})

    return {
        schedule: value.normal,
        schedules: metadata.schedules
    }


}) satisfies PageServerLoad;