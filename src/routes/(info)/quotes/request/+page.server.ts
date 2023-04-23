import {dev} from "$app/environment";
import { env } from "$env/dynamic/private";
import type {Actions, ServerLoad} from "@sveltejs/kit";
import {fail, redirect} from "@sveltejs/kit";




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


export const actions = {
    submit: async ({platform, request, getClientAddress}) => {

        const data = await request.formData();
        const quote = data.get("quote");
        const author = data.get("author");
        const note = data.get("note");

        if(typeof quote != "string" || typeof author != "string") {
            return fail(400, {message: "Please provide a quote and an author!"})
        }

        const token = data.get("cf-turnstile-response");

        if(!token) return fail(400, {message: "Invalid turnstile response!"})

        const ip = request.headers.get('CF-Connecting-IP') || getClientAddress();

        let formData = new FormData();
        formData.append('secret', env.TURNSTILE_SECRET);
        formData.append('response', token);
        formData.append('remoteip', ip);

        const turnstileResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                body: formData
            }
        ).then(r => r.json());

        if(!turnstileResponse.success) {
            return fail(400, {message: "Failed turnstile! Errors: " + turnstileResponse["error-codes"]});
        }


        let kv = platform?.env?.QUOTE_SUGGESTIONS;
        if(!kv) return fail(500, {message: "Invalid platform (no kv)"})

        const id = crypto.randomUUID();

        await kv.put(id, JSON.stringify({quote, author, note}), {
            metadata: {
                quotePreview: quote.substring(0, Math.min(128, author.length)),
                authorPreview: author.substring(0, Math.min(64, author.length)),
                status: "pending",
                submitted: Date.now()
            }
        });

        throw redirect(302, "/quotes/request/" + id);


    }
} satisfies Actions