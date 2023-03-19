import type {RequestHandler} from "@sveltejs/kit";
import {text} from "@sveltejs/kit";

export const GET = (() => {
    return text("TODO");
}) satisfies RequestHandler;