import {dev} from "$app/environment";
import type {Actions, ServerLoad} from "@sveltejs/kit";
import { fail, redirect} from "@sveltejs/kit";




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

    if(!list_complete) {
        let more = await kv.list({cursor});
        keys.push(more.keys);
        list_complete = more.list_complete;
        cursor = more.cursor;
    }


    // @ts-ignore
    keys = keys.filter(r => r.metadata.status === "pending");


    return {
        hasList: true,
        list: keys,
        list_complete,
        cursor
    }
}) satisfies ServerLoad;


export const actions = {
    submit: async ({platform, request}) => {

        const data = await request.formData();
        const quote = data.get("quote");
        const author = data.get("author");
        const note = data.get("note");

        if(typeof quote != "string" || typeof author != "string") {
            return fail(400, {message: "Please provide a quote and an author!"})
        }


        let kv = platform?.env?.QUOTE_SUGGESTIONS;
        if(!kv) return fail(500, {message: "Invalid platform (no kv)"})

        const id = crypto.randomUUID();

        await kv.put(id, JSON.stringify({quote, author, note}), {
            metadata: {
                quotePreview: author.substring(0, Math.min(128, author.length)),
                authorPreview: author.substring(0, Math.min(64, author.length)),
                status: "pending",
                submitted: Date.now()
            }
        });

        throw redirect(302, "/quotes/request/" + id);


    }
} satisfies Actions