import type {RequestHandler} from "@sveltejs/kit";
import {error, json, redirect, text} from "@sveltejs/kit";
import {dev} from "$app/environment";

export const GET = (async ({platform, url, locals}) => {
    if(!(typeof locals?.user?.id == "number" && locals?.user?.id == 0)) {
        return json({error: "Not authorized", type: typeof locals?.user?.id, id: locals?.user?.id});
    }
    const bucket = platform?.env?.SCHEDULE_BUCKET;
    if(!bucket) {
        return json({ error: "Bucket not found" }, { status: 500 });
    }

    const value = url.searchParams.get("value");
    const obj = await bucket.put("test", JSON.stringify({value}), {
        httpMetadata: {
            contentType: "application/json",
            cacheControl: "max-age=30, must-revalidate"
        }
    });

    return json({put: value, obj});
}) satisfies RequestHandler;