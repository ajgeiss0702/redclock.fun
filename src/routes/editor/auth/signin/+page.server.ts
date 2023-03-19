import type {Actions} from "@sveltejs/kit";
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
            const {key, name, user} = await (platform.env.D1DB.prepare("select password as key,name,id as user from users where username=?")
                .bind(username)
                .first()) ?? {};

            if((key && name && !isNaN(Number(user))) && await pbkdf2Verify(key, password as string)) {
                const sessionId = crypto.randomUUID();
                await (platform.env.D1DB.prepare("insert into sessions (id, created, user) values (?, ?, ?)")
                    .bind(sessionId, Date.now(), user))

                const futureExpiry = new Date();
                futureExpiry.setFullYear(futureExpiry.getFullYear() + 1);

                cookies.set("session", sessionId, {path: "/", expires: futureExpiry});

                throw redirect(303, "/editor");
            } else {
                return fail(400, {username, incorrect: true})
            }
        } else if(dev) {
            return {username, message: "dev signin"}
        } else {
            return fail(500, {username, message: "Server error: Missing DB!"})
        }
    }
} satisfies Actions;

type SimpleRateLimit = {
    [ip: string]: number[]
};