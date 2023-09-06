import { env } from "$env/dynamic/private";
import type {Actions, ServerLoad} from "@sveltejs/kit";
import {fail, redirect} from "@sveltejs/kit";
import {dev} from "$app/environment";
import { quotes } from "$lib/quotes";
import { similarity } from "$lib/utils";
import {bannedPhrases} from "$lib/quoteSettings";

export const load = (async ({locals}) => {
    return {isAdmin: dev || locals?.user?.id === 0}
}) satisfies ServerLoad

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

        if(!env.TURNSTILE_SECRET) return fail(503, {message: "Invalid turnstile secret!"})

        let formData = new FormData();
        formData.append('secret', env.TURNSTILE_SECRET);
        formData.append('response', token);
        formData.append('remoteip', ip);

        const turnstileResponse: {success: boolean, "error-codes"?: string[]} = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                body: formData
            }
        ).then(r => r.json());

        if(!turnstileResponse.success) {
            return fail(400, {message: "Failed turnstile! Errors: " + turnstileResponse["error-codes"]});
        }

        for (let bannedPhrase of bannedPhrases) {
            if(quote.trim().toLowerCase().includes(bannedPhrase)) {
                return fail(400, {message: "Quote banned!"})
            }
        }


        let kv = platform?.env?.QUOTE_SUGGESTIONS;
        if(!kv) return fail(500, {message: "Invalid platform (no kv)"})

        let similarQuotes = [];
        for (const i in quotes) {
            let q = quotes[i].quote;
            let sim = similarity(quote, q);
            if(sim > 0.3) {
                similarQuotes.push({
                    similarity: sim,
                    quote: {
                        quoteNumber: i,
                        ...quotes[i]
                    }
                })
            }
        }

        const id = crypto.randomUUID();

        await kv.put(id, JSON.stringify({quote, author, note, similarQuotes}), {
            metadata: {
                quotePreview: quote.substring(0, Math.min(128, quote.length)),
                authorPreview: author.substring(0, Math.min(64, author.length)),
                status: "pending",
                submitted: Date.now()
            }
        });

        if(!dev && platform?.context?.waitUntil) { // don't send discord webhook in dev
            platform.context.waitUntil(fetch(
                "https://discord.com/api/webhooks/1100085438510813249/1o-4gnLjHi0I2c2PzCoy4m3RXKkPYblGg5eDbTq6UMZzP-OmdYwockDXuk0sIE5tUoYN",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        content: "New quote request: https://redclock.fun/quotes/request/" + id
                    })
                }
            ))
        }


        throw redirect(302, "/quotes/request/" + id + "?s");
    }
} satisfies Actions