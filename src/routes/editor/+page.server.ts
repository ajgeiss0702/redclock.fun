import type {ServerLoad} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {error} from "@sveltejs/kit";

export const load = (async ({locals, platform}) => {
    if(!locals.user) return {};

    if(dev) {
        return {
            schools: [{
                code: "rmhs",
                timezone: 420,
                logo: "https://redclock.fun/img/schools/rmhs.webp",
                display: "Red Mountain High School",
                offset: 0
            }]
        }
    }

    if(!platform?.env?.D1DB) {
        throw error(500, "no db!");
    }

    return {
        schools: (await (
            platform.env.D1DB.prepare("select * from schools;")
                .all()
        )).results
    }
    
}) satisfies ServerLoad