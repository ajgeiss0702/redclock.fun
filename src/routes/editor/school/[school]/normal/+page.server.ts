import type { PageServerLoad } from './$types';
import { devSchedule, devSchedules } from '$lib/server/devData';
import {dev} from "$app/environment";
import {error} from "@sveltejs/kit";
import type {SchoolData} from "$lib/countdown/countdown-utils";

export const load = (async ({locals, parent, platform, params}) => {
    if(!locals.user) return {};

    const schools = platform?.env?.SCHOOLS;
    if(!schools && dev) {
        return {
            schedule: devSchedule,
            schedules: devSchedules
        }
    } else if(!schools) {
        throw error(500, "No school store!")
    }

    const {value, metadata} = await schools.getWithMetadata<SchoolData, SchoolData>(params.school, {type: "json"})

    return {
        schedule: value?.normal,
        schedules: metadata?.schedules
    }


}) satisfies PageServerLoad;