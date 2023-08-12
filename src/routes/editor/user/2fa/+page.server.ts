import type {Actions} from "./$types";
import type {PageServerLoad} from "./$types";
import {generateRandomBase32, getTotp, validate} from "$lib/server/2fa";
import {error, fail} from "@sveltejs/kit";
import * as OTPAuth from "otpauth";
import {dev} from "$app/environment";

export const load = (async ({locals, platform, request}) => {
    const user = locals.user;
    if(!user || user.has2fa) return {};

    const cache = platform?.env?.CACHE as KVNamespace;
    if(!cache) throw error(503, "Cache not available!");

    let twoFactorURI;
    let id;

    let expiration;

    const isPost = request.method == "POST";

    // Preserve totp token between verification attempts
    if(isPost) {
        const data = await request.formData();
        id = data.get("id") as string;

        if(id) {
            let existingData = await cache.getWithMetadata<{expiration?: number}>("rc:temp_id:" + id);

            expiration = existingData.metadata?.expiration ?? Number.MAX_VALUE;

            // Only preserve if it still exists, and is not about to expire
            if(existingData.value && ((Date.now()/1000) - expiration) > 5) {
                twoFactorURI = existingData.value;
            }
        }
    }

    if(!isPost || !twoFactorURI) {
        expiration = (Date.now() / 1000) + (60 * 2)
        twoFactorURI = getTotp(generateRandomBase32()).toString()
        id = crypto.randomUUID();
        await cache.put("rc:temp_id:" + id, twoFactorURI, {expiration});
    }

    return {
        twoFactorURI,
        id,
        expiration
    }

}) satisfies PageServerLoad

export const actions = ({
    enroll: async ({platform, request, locals}) => {
        const user = locals.user;
        if(!user) return fail(401, {message: "You are not logged in!"});

        const data = await request.formData();

        const id = data.get("id") as string;
        const code = data.get("confirmation-code") as string;

        if(!id) return fail(400, {message: "Missing ID!"});
        if(!code) return fail(400, {message: "Missing confirmation code!"});

        const cache = platform?.env?.CACHE as KVNamespace;
        if(!cache) return fail(503, {message: "Missing cache!"});

        const URI = await cache.get("rc:temp_id:" + id);

        if(!URI) return fail(400, {message: "Invalid ID! It might have expired. Reload the page and try again."});

        const totp = OTPAuth.URI.parse(URI);

        if(totp.validate({token: code, window: 1}) == null) {
            return fail(400, {message: "The code you entered was invalid. Please try again."})
        }

        const db = platform?.env?.D1DB as D1Database;
        if(!db && dev) return;
        if(!db) return fail(503, {message: "Missing DB!"});

        await db.prepare("update users set `2fa`=? WHERE id=?")
            .bind(totp.secret.base32, user.id)
            .run()

    },
    unenroll: async ({platform, request, locals}) => {
        const user = locals.user
        if(!user) return fail(401, {message: "You are not logged in!"});

        const data = await request.formData();

        const code = data.get("confirmation-code") as string;
        if(!code) return fail(400, {message: "Missing confirmation code!"});

        const db = platform?.env?.D1DB as D1Database;
        if(!db && dev) return;
        if(!db) return fail(503, {message: "Missing DB!"});

        console.log("un-enrolling user");

        const secret = await db.prepare("select `2fa` from users where id=?")
            .bind(user.id)
            .first<string>("2fa")
        if(!secret) return fail(400, {message: "You do not have 2fa, so you cannot be un-enrolled!"});

        console.log("secret fetched")

        if(!validate(secret, code)) return fail(400, {message: "Invalid code! Please try again"});

        console.log("code is valid")

        await db.prepare("update users set `2fa`=NULL WHERE id=?")
            .bind(user.id)
            .run()

    }
}) satisfies Actions