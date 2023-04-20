import type {ServerLoad} from "@sveltejs/kit";
import {redirect} from "@sveltejs/kit";


export const load = (async ({cookies, url}) => {
    if(!cookies.get("school") && !cookies.get("schedule")) return {};
    if(url.searchParams.has("noRedirect")) return {};

    if(cookies.get("alwaysRedirect") === "true") throw redirect(302, "/countdown");
}) satisfies ServerLoad;