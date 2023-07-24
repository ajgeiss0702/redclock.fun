import type {RequestHandler} from "@sveltejs/kit";
import {error, json} from "@sveltejs/kit";

export const GET = (async ({platform, params}) => {
    const requests = platform?.env?.QUOTE_SUGGESTIONS;
    if(!requests) throw error(503, "Requests KV missing");

    const id = params.requestId;
    if(!id) throw error(400, "Missing ID");

    const {value, metadata} = await requests.getWithMetadata(id, {type: "json"});

    return json({
        id,
        value,
        metadata
    })

}) satisfies RequestHandler;