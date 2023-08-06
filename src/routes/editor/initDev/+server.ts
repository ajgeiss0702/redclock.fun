import type {RequestHandler} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {error, json} from "@sveltejs/kit";
import {devData, devMeta} from "./devData";

export const GET = (async ({platform}) => {
    if(!dev) throw error(503, "Not available in production environment");

    const schools = platform?.env?.SCHOOLS;
    const districts = platform?.env?.DISTRICTS;

    if(!schools || !districts) {
        throw error(500, "Missing school or district KV!")
    }

    schools.put("rmhs", JSON.stringify(devData), {
        metadata: devMeta
    });

    districts.put("mpsaz", JSON.stringify(
        {off: {}}
    ), {
        metadata: {
            logo: "https://redclock.fun/img/districts/mpsaz.webp",
            display: "Mesa Public Schools"
        }
    });

    return json({done: true});
}) satisfies RequestHandler