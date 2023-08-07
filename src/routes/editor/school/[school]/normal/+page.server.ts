import type { PageServerLoad } from './$types';
import { devSchedule, devSchedules } from '$lib/server/devData';
import {dev} from "$app/environment";
import {type Actions, error, fail} from "@sveltejs/kit";
import type {SchoolData} from "$lib/countdown/countdown-utils";
import {hasPermission} from "$lib/server/users";
import {putSchedule} from "$lib/server/schedulePutter";

export const load = (async ({locals, parent, platform, params}) => {
    if(!locals.user) return {};

    const schools = platform?.env?.SCHOOLS as KVNamespace | undefined;
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

export const actions = {
    default: (async ({locals, request, platform, params}) => {
        if(!locals.user) return fail(401);
        if(!params.school) return fail(400, {message: "Missing school parameter"});

        if(!await hasPermission(platform?.env, locals.user.id, "school." + params.school)) {
            return fail(401, {message: "You don't have permission to modify this school!"});
        }

        const formData = await request.formData();

        const newScheduleRaw = formData.get("new-schedule");

        if(!newScheduleRaw) return fail(400, {message: "Missing new schedule!"})
        const newSchedule = JSON.parse(newScheduleRaw as string)

        const schools = platform?.env?.SCHOOLS;
        if(!schools) return fail(503, {message: "Missing schools!"})

        await putSchedule(schools, params.school, newSchedule, "normal");
    })
} satisfies Actions