import {dev} from "$app/environment";
import type {ServerLoad} from "@sveltejs/kit";

export const load = (async ({platform, locals}) => {
    if(dev) {
        let list = [
            {
                name: "00000000-0000-0000-0000-000000000000",
                metadata: {
                    quotePreview: "Test Quote",
                    authorPreview: "Test Author",
                    status: "pending",
                    submitted: 1682197077711
                }
            },
            {
                name: "00000000-0000-0000-0000-000000000001",
                metadata: {
                    quotePreview: "Test Quote 2",
                    authorPreview: "Test Author",
                    status: "pending",
                    submitted: 1682364416764
                }
            }
        ]
        list.sort((a, b) => b.metadata.submitted - a.metadata.submitted);
        return {
            hasList: true,
            list
        }
    }

    if(locals?.user?.id != 0) return {};

    let kv = platform?.env?.QUOTE_SUGGESTIONS;
    if(!kv) return {};

    let {keys, list_complete, cursor} = (await kv.list()) as KVListResponse;

    let i = 0;
    while(!list_complete && i < 500) {
        let more = await kv.list({cursor});
        keys.push(more.keys);
        list_complete = more.list_complete;
        cursor = more.cursor;
        i++;
    }

    keys.sort((a, b) => b.metadata.submitted - a.metadata.submitted);


    return {
        hasList: true,
        list: keys,
        list_complete,
        cursor
    }
}) satisfies ServerLoad;