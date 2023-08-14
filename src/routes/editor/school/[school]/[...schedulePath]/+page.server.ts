import type { PageServerLoad } from './$types';
import { devSchedule, devSchedules } from '$lib/server/devData';
import {dev} from "$app/environment";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import type {SchoolData} from "$lib/countdown/countdown-utils";
import {hasPermission} from "$lib/server/users";
import {putSchedule} from "$lib/server/schedulePutter";

export const load = (async ({locals, parent, platform, params, url}) => {
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
    
    const {value, metadata} = await schools.getWithMetadata<SchoolData, SchoolData>(params.school, {type: "json"});

    if(value == null) throw error(404, "School not found");

    let current: unknown = value;
    let isNew = false;
    const parts = params.schedulePath.split("/");
    for (let part of parts) {
        part = part.replaceAll("-", "/");
        // @ts-ignore
        let newCurrent = current[part];
        if(!newCurrent && url.searchParams.has("new")) {
            current = {};
            isNew = true;
            break;
        } else if(!newCurrent) {
            throw error(404, "Unknown schedule name (lost at " + part + ")")
        }
        current = newCurrent;
    }

    if(!isNew && url.searchParams.has("new")) {
        throw redirect(302, url.pathname);
    }

    return {
        schedule: current,
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

        if(!params.schedulePath) return fail(400, {message: "Invalid schedule path"});

        const scheduleParts = params.schedulePath.split("/");
        if(scheduleParts.length > 1) scheduleParts.shift()

        await putSchedule(locals.user, schools, params.school, newSchedule, scheduleParts[0], scheduleParts[1]);
    })
} satisfies Actions