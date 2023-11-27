import {dev} from "$app/environment";
import type {Actions, RequestEvent, ServerLoad} from "@sveltejs/kit";
import {error, fail} from "@sveltejs/kit";
import type {Quote, QuoteRequestMetadata, QuoteRequestValue} from "$lib/quoteSettings";
import {similarity} from "$lib/utils";
import {updatePendingCount} from "$lib/server/quoteUtils";

export const load = (async ({platform, params, locals}) => {
    const id = params.requestId;
    if(!id) throw error(400, "Need a request ID");

    let kv = platform?.env?.QUOTE_SUGGESTIONS;

    if(dev && !kv) return {
        id: "00000000-0000-0000-0000-000000000000",
        value: {
            quote: "Test Quote",
            author: "Test Author",
            note: Math.floor(Math.random() * 50) + " Very cool quote and stuff yeah this is a very long note ans stuff and more stuff bla bla bla"
        },
        metadata: {
            quotePreview: "Test Quote",
            authorPreview: "Test Author",
            status: "accepted",
            reason: "test reason",
            expiration: 1683359991,
            submitted: 1679217077711
        },
        canManage: true
    }


    if(!kv) return {};
    if(id === "count") throw error(404, "Quote not found");

    const canManage = (dev || locals?.user?.id === 0);

    const {value, metadata} = await kv.getWithMetadata<QuoteRequestValue, QuoteRequestMetadata>(id, {type: "json"});

    if(!value) throw error(404, "Quote not found");

    let similarQuoteRequests: (Quote & {id: string, similarity: number, status: string})[] = [];

    if(canManage && metadata && metadata.status === "pending") {
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
        keys = keys.filter(k => k.name !== "count")

        for (let key of keys/*.filter(k => k.metadata?.status === "pending")*/) {
            if(!key?.metadata) continue;
            if(key.name == id) continue;
            const sim = similarity(metadata.quotePreview, key.metadata.quotePreview);
            if(sim > 0.3) {
                similarQuoteRequests.push({
                    id: key.name,
                    quote: key.metadata.quotePreview,
                    author: key.metadata.authorPreview,
                    status: key.metadata.status,
                    similarity: sim
                })
            }
        }
    }


    return {
        id,
        value,
        metadata,
        canManage,
        similarQuoteRequests
    }
}) satisfies ServerLoad;


export let actions = {
    accept: e => setStatus("accepted", e),
    deny: e => setStatus("denied", e),
    pend: e => setStatus("pending", e)
} satisfies Actions;

async function setStatus(status: string, {platform, request, params, locals}: RequestEvent) {

    if(!dev && locals?.user?.id != 0) return fail(401, {message: "You don't have permission to do this!"})

    // @ts-ignore im not going to put all million arguments
    let data = await load({platform, params, locals});

    const formData = await request.formData();
    const reason = formData.get("reason");

    let kv = platform?.env?.QUOTE_SUGGESTIONS;
    if(!kv) return fail(500, {message: "Invalid platform (no kv)"})

    let expiration;
    if(status === "denied") {
        expiration = Math.round((Date.now() + (1000 * 60 * 60 * 24 * 180)) / 1000);
    }

    await kv.put(data.id as string, JSON.stringify(data.value), {
        metadata: {
            ...data.metadata,
            reason: reason,
            status: status,
            expiration
        },
        expiration
    });

    await updatePendingCount(kv);

}