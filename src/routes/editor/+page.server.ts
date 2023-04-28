import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

export const load = (async ({locals, platform}) => {
    if(!locals.user) return {};

    const schools = platform?.env?.SCHOOLS;
    const districts = platform?.env?.DISTRICTS;

    if(!schools || !districts) {
        throw error(500, "Missing school or district KV!");
    }

    return {
        schools: ((await schools.list()) as KVListResponse).keys,
        districts: ((await districts.list()) as KVListResponse).keys
    }
    
}) satisfies ServerLoad