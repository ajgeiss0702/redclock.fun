import {dev} from "$app/environment";
import type {ServerLoad} from "@sveltejs/kit";
import type {QuoteRequestMetadata} from "$lib/quoteSettings";

export const load = (async ({platform, locals}) => {
    let kv = platform?.env?.QUOTE_SUGGESTIONS;
    if(dev && !kv) {
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
                    quotePreview: "Test Quote 2 (t:" + Math.floor(Math.random() * 50) + ")",
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

    if(!dev && locals?.user?.id != 0) return {};


    if(!kv) return {};

    // @ts-ignore
    let {keys, list_complete, cursor} = (await kv.list<QuoteRequestMetadata>());

    let i = 0;
    while(!list_complete && i < 500) {
        let more = await kv.list<QuoteRequestMetadata>({cursor});
        keys.push(...more.keys);
        list_complete = more.list_complete;
        // @ts-ignore
        cursor = more.cursor;
        i++;
    }
    keys = keys.filter(k => k.name !== "count");

    keys.sort((a, b) => b.metadata.submitted - a.metadata.submitted);


    return {
        hasList: true,
        list: keys,
        list_complete,
        cursor
    }
}) satisfies ServerLoad;