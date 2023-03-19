import type {Actions} from "@sveltejs/kit";
import {fail} from "@sveltejs/kit";

let simpleRateLimit: SimpleRateLimit = {};

export const actions = {
    default: async ({cookies, request, getClientAddress}) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");

        console.log("IP is " + getClientAddress())

        if(!username || !password) {
            return fail(400, {username, missing: true})
        }
        return { message: "TODO" }
    }
} satisfies Actions;

type SimpleRateLimit = {
    [ip: string]: number[]
};