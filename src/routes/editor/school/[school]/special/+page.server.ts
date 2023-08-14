import type {Actions} from "./$types";
import {fail} from "@sveltejs/kit";
import {hasPermission} from "$lib/server/users";
import {putSchedule} from "$lib/server/schedulePutter";


export const actions = {
    removeDay: async ({url, locals, platform, params}) => {
        if(!locals.user) return fail(401, {message: "Not logged in!"});
        if(!params.school) return fail(400, {message: "Missing school!"})

        if(!await hasPermission(platform?.env, locals.user.id, "school." + params.school)) {
            return fail(401, {message: "You don't have permission to modify this school!"});
        }

        const day = url.searchParams.get("day");
        if(!day) return fail(400, {message: "Missing day to remove!"});

        const schools = platform?.env?.SCHOOLS as KVNamespace;
        if(!schools) return fail(503, {message: "Missing schools!"})

        await putSchedule(locals.user, schools, params.school, undefined, "day", day)

    },
    removeDate: async ({url, locals, platform, params}) => {
        if(!locals.user) return fail(401, {message: "Not logged in!"});
        if(!params.school) return fail(400, {message: "Missing school!"})

        if(!await hasPermission(platform?.env, locals.user.id, "school." + params.school)) {
            return fail(401, {message: "You don't have permission to modify this school"});
        }

        const date = url.searchParams.get("date");
        if(!date) return fail(400, {message: "Missing date to remove!"});

        const schools = platform?.env?.SCHOOLS as KVNamespace;
        if(!schools) return fail(503, {message: "Missing schools!"})

        await putSchedule(locals.user, schools, params.school, undefined, "date", date)
    }
} satisfies Actions