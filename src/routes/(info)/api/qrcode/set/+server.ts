import type {RequestHandler} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {error, redirect} from "@sveltejs/kit";

export const GET = (async ({platform, url}) => {
    if(!dev) throw error(503, "Not available in prod");

    const cache = platform?.env?.CACHE;
    if(!cache) throw error(503, "no cache");

    const text = url.searchParams.get("text");
    if(!text) throw error(400, "no text");

    const id = crypto.randomUUID();

    await cache.put("rc:temp_id:" + id, text, {expirationTtl: 60});

    throw redirect(302, "/api/qrcode?id=" + id);

}) satisfies RequestHandler;