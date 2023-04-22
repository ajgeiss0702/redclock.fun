import {dev} from "$app/environment";
import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

export const load = (async ({platform, locals, params}) => {
    const id = params.requestId;
    if(!id) throw error(400, "Need a request ID");
    if(dev) return {
        value: {
            quote: "Test Quote",
            author: "Test Author",
            note: "Very cool quote"
        },
        metadata: {
            quotePreview: "Test Quote",
            authorPreview: "Test Author",
            status: "pending",
            submitted: 1682197077711
        }
    }

    let kv = platform?.env?.QUOTE_SUGGESTIONS;
    if(!kv) return {};

    const {value, metadata} = await kv.getWithMetadata(id);


    return {
        value,
        metadata
    }
}) satisfies ServerLoad;