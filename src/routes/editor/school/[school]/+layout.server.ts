import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

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

    const {value, metadata} = await schools.getWithMetadata(params.school, {type: "json"});

    if(!value) throw error(404, "School not found.");

    return {
        school: {
            code: params.school,
            ...metadata,
            ...value
        }
    }

}) satisfies ServerLoad