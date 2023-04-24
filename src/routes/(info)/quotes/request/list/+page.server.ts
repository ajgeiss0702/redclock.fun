import {dev} from "$app/environment";
import type {ServerLoad} from "@sveltejs/kit";

export const load = (async ({platform, locals}) => {
    if(dev) return {
        hasList: true,
        list: [
            {
                name: "00000000-0000-0000-0000-000000000000",
                metadata: {
                    quotePreview: "Test Quote",
                    authorPreview: "Test Author",
                    status: "pending",
                    submitted: 1682197077711
                }
            }
        ]
    }

    if(locals?.user?.id != 0) return {};

    let kv = platform?.env?.QUOTE_SUGGESTIONS;
    if(!kv) return {};

    let {keys, list_complete, cursor} = await kv.list();

    let i = 0;
    while(!list_complete && i < 500) {
        let more = await kv.list({cursor});
        keys.push(more.keys);
        list_complete = more.list_complete;
        cursor = more.cursor;
        i++;
    }



    return {
        hasList: true,
        list: keys,
        list_complete,
        cursor
    }
}) satisfies ServerLoad;