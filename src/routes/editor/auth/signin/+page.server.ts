import type {Actions} from "./$types";
import {fail, redirect} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {pbkdf2Verify} from "$lib/server/crypto-pbkdf2";

let simpleRateLimit: SimpleRateLimit = {};

export const actions = {
    default: async ({platform, cookies, request, getClientAddress}) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");

        if(!username || !password) {
            return fail(400, {username, missing: true})
        }

        let limits = simpleRateLimit[getClientAddress()] ?? [];
        // remove any requests older than 60 seconds (which will probably never happen but better to be safe)
        limits = limits.filter(t => t > (Date.now() - 60e3));

        if(limits.length > 3) {
            return fail(429, {username, ratelimited: true})
        }
        limits.push(Date.now());
        simpleRateLimit[getClientAddress()] = limits;

        if(platform?.env?.D1DB) {
            const {key, name, userId, twofa} = await (
                platform.env.D1DB.prepare("select password as key,name,id as userId, `2fa` as twofa from users where username=?")
                .bind(username)
                .first()
            ) ?? {};

            if((key && name && !isNaN(Number(userId))) && await pbkdf2Verify(key as string, password as string)) {
                const sessionId = crypto.randomUUID();

                if(twofa == null) {
                    await platform.env.SESSION_STORE.put(sessionId, userId+"", {
                        expirationTtl: 60 * 60 * 24 * 30 // sessions last for 30 days
                    })
                } else {
                    await platform.env.SESSION_STORE.put(sessionId + ":verifying", userId+"", {
                        expirationTtl: 60 * 5, // 2fa sessions last for 5 minutes
                        metadata: {
                            secret: twofa
                        }
                    })
                }

                const futureExpiry = new Date();
                futureExpiry.setDate(futureExpiry.getDate() + 30);

                cookies.set("session", sessionId, {path: "/", expires: futureExpiry});

                const to = new URL(request.url).searchParams.get("to");

                if(twofa == null) {
                    throw redirect(303, to == null ? "/editor" : to);
                } else {
                    throw redirect(303, to == null ? "/editor/auth/2fa" : "/editor/auth/2fa?to=" + encodeURIComponent(to));
                }
            } else {
                return fail(400, {username, incorrect: true})
            }
        } else if(dev) {
            console.log("Creating dev session");
            const futureExpiry = new Date();
            futureExpiry.setFullYear(futureExpiry.getFullYear() + 1);

            cookies.set("session", "00000000-0000-0000-0000-000000000000", {path: "/"});

            const to = new URL(request.url).searchParams.get("to");

            throw redirect(303, to == null ? "/editor" : to);
        } else {
            return fail(500, {username, message: "Server error: Missing DB!"})
        }
    }
} satisfies Actions;

type SimpleRateLimit = {
    [ip: string]: number[]
};