import {dev} from "$app/environment";
import { env } from "$env/dynamic/private";
import type {Actions, ServerLoad} from "@sveltejs/kit";
import {fail, redirect} from "@sveltejs/kit";



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

        await fetch(
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
        )


        throw redirect(302, "/quotes/request/" + id);
    }
} satisfies Actions