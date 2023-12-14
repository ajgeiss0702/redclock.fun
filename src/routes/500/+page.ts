import {error} from "@sveltejs/kit";

export const prerender = false;

export const load = () => {
    throw error(500, "test 500 error");
}