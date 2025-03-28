import type {RequestHandler} from "@sveltejs/kit";
import {error, redirect, text} from "@sveltejs/kit";
import {dev} from "$app/environment";

export const GET = (async ({platform, cookies}) => {
    const sessionId = cookies.get("session");
    if(!sessionId) throw redirect(302, "/editor");

    if(!dev) {
        if(!platform?.env?.D1DB) {
            throw error(500, "no db!")
        }

        await platform.env.SESSION_STORE.delete(sessionId);
    }

    cookies.delete("session", {path: "/"});

    throw redirect(302, "/editor");
}) satisfies RequestHandler;