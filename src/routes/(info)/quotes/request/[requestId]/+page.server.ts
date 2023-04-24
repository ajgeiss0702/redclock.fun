import {dev} from "$app/environment";
import type {Actions, RequestEvent, ServerLoad} from "@sveltejs/kit";
import {error, fail} from "@sveltejs/kit";

export const load = (async ({platform, params, locals}) => {
    const id = params.requestId;
    if(!id) throw error(400, "Need a request ID");
    if(dev) return {
        id: "00000000-0000-0000-0000-000000000000",
        value: {
            quote: "Test Quote",
            author: "Test Author",
            note: "Very cool quote and stuff yeah this is a very long note ans stuff and more stuff bla bla bla"
        },
        metadata: {
            quotePreview: "Test Quote",
            authorPreview: "Test Author",
            status: "denied",
            reason: "test reason",
            expiration: 1683359991,
            submitted: 1679217077711
        },
        canManage: true
    }

    let kv = platform?.env?.QUOTE_SUGGESTIONS;
    if(!kv) return {};

    const {value, metadata} = await kv.getWithMetadata(id, {type: "json"});

    if(!value) throw error(404, "Quote not found");


    return {
        id,
        value,
        metadata,
        canManage: (locals?.user?.id === 0)
    }
}) satisfies ServerLoad;


export let actions = {
    accept: e => setStatus("accepted", e),
    deny: e => setStatus("denied", e),
    pend: e => setStatus("pending", e)
} satisfies Actions;

async function setStatus(status: string, {platform, request, params, locals}: RequestEvent) {

    if(locals?.user?.id != 0) return fail(401, {message: "You don't have permission to do this!"})

    // @ts-ignore im not going to put all million arguments
    let data = await load({platform, params, locals});

    const formData = await request.formData();
    const reason = formData.get("reason");

    let kv = platform?.env?.QUOTE_SUGGESTIONS;
    if(!kv) return fail(500, {message: "Invalid platform (no kv)"})

    let expiration;
    if(status === "denied") {
        expiration = (Date.now() + (1000 * 60 * 60 * 24 * 90)) / 1000;
    }

    await kv.put(data.id, JSON.stringify(data.value), {
        metadata: {
            ...data.metadata,
            reason: reason,
            status: status,
            expiration
        },
        expiration
    });

}