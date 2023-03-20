import type {RequestHandler} from "@sveltejs/kit";
import {error, redirect, text} from "@sveltejs/kit";
import {dev} from "$app/environment";

export const GET = (({platform, cookies}) => {
    const sessionId = cookies.get("session");
    if(!sessionId) throw redirect(302, "/editor");

    if(!dev) {
        if(!platform?.env?.D1DB) {
            throw error(500, "no db!")
        }

        platform.env.D1DB.prepare("delete from sessions where id=?")
            .bind(sessionId)
            .run()
    }

    cookies.delete("session", {path: "/"});

    throw redirect(302, "/editor");
}) satisfies RequestHandler;