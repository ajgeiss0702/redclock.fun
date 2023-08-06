import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import {hasPermission} from "$lib/server/users";

export const load = (async ({params, locals, platform}) => {
    if(!locals.user) return {};

    if(!params.school) {
        throw error(400, "school code required!")
    }

    const schools = platform?.env?.SCHOOLS;
    const districts = platform?.env?.DISTRICTS;

    if(!schools || !districts) {
        throw error(500, "Missing school or district KV!");
    }

    const permission = hasPermission(platform.env, locals.user.id, "school." + params.school);

    const {value, metadata} = await schools.getWithMetadata<unknown, EditorSchool>(params.school, {type: "json"});

    if(!(await permission)) throw error(400, "You don't have permission for this school!")

    if(!value) throw error(404, "School not found.");

    return {
        school: {
            code: params.school,
            ...metadata,
            ...value
        }
    }

}) satisfies ServerLoad