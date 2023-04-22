import {dev} from "$app/environment";
import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

export const load = (async ({platform, params}) => {
    const id = params.requestId;
    if(!id) throw error(400, "Need a request ID");
    if(dev) return {
        id: "00000000-0000-0000-0000-000000000000",
        value: {
            quote: "Test Quote",
            author: "Test Author",
            note: "Very cool quote"
        },
        metadata: {
            quotePreview: "Test Quote",
            authorPreview: "Test Author",
            status: "pending",
            reason: "test reason",
            submitted: 1679217077711
        }
    }

    let kv = platform?.env?.QUOTE_SUGGESTIONS;
    if(!kv) return {};

    const {value, metadata} = await kv.getWithMetadata(id, {type: "json"});

    if(!value) throw error(404, "Quote not found");


    return {
        id,
        value,
        metadata
    }
}) satisfies ServerLoad;