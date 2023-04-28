import type {RequestHandler} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {error, text} from "@sveltejs/kit";
import {pbkdf2} from "$lib/server/crypto-pbkdf2";

export const GET = (async ({url}) => {
    if(!dev) throw error(503, "Not available in production environment");

    const pw = url.searchParams.get("pw");

    if(!pw) {
        throw error(400, "missing required arg");
    }

    return text(await pbkdf2(pw))
}) satisfies RequestHandler;