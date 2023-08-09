import type {PageServerLoad} from "./$types";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import {validate} from "$lib/server/2fa";

export const load = (async ({platform, cookies}) => {
    const sessionStore = platform?.env?.SESSION_STORE as KVNamespace;

    if(!sessionStore) throw error(503, "Session store not available!");

    const sessionId = cookies.get("session");

    if(!sessionId) throw redirect(303, "/editor/auth/signin");

    const session = await sessionStore.getWithMetadata(sessionId + ":verifying");
    if(!session.value) throw redirect(303, "/editor/auth/signin");
}) satisfies PageServerLoad;

export const actions = {
    default: async ({platform, cookies, request}) => {
        const sessionStore = platform?.env?.SESSION_STORE as KVNamespace;
        if(!sessionStore) throw error(503, "Session store is not available!");

        const sessionId = cookies.get("session");
        if(!sessionId) throw redirect(303, "/editor/auth/signin");

        const session = await sessionStore.getWithMetadata<{secret: string}>(sessionId + ":verifying");
        if(!session.value) throw redirect(303, "/editor/auth/signin?reauth");

        const secret = session.metadata?.secret;

        if(!secret) throw error(500, "Missing secret from session");

        const data = await request.formData();
        const token = data.get("token") as string | null;

        if(!token) return fail(400, {missing: true});

        if(!validate(secret, token)) {
            const special = validate(secret, token, 5);
            console.log("Invalid token", {secret, token, special});
            return fail(401, {incorrect: true, special});
        }

        await sessionStore.put(sessionId, session.value, {
            expirationTtl: 60 * 60 * 24 * 30 // sessions last for 30 days
        })

        const to = new URL(request.url).searchParams.get("to");
        throw redirect(303, to == null ? "/editor" : to);

    }
} satisfies Actions