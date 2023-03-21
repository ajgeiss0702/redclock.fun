import type {ServerLoad} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {error} from "@sveltejs/kit";

export const load = (async ({params, locals, platform}) => {
    if(!locals.user) return {};

    if(!params.school) {
        throw error(400, "school code required!")
    }

    if(dev) {
        // @ts-ignore
        const {devSchools}: EditorSchool[] = await import("$lib/server/devSchools.js");
        for (const school of devSchools) {
            if(school.code == params.school) return {school};
        }
        throw error(404, "School not found.");
    }

    if(!platform?.env?.D1DB) {
        throw error(500, "no db!");
    }

    const results = (await (
        platform.env.D1DB.prepare("select * from schools where code=?;")
            .bind(params.school)
            .first()
    ));

    if(!results) throw error(404, "School not found.");

    return {
        school: results
    }

}) satisfies ServerLoad