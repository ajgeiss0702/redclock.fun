import type {ServerLoad} from "@sveltejs/kit";
import {redirect} from "@sveltejs/kit";


export const load = (async ({cookies, url}) => {

    const school = cookies.get("school");
    const schedule = cookies.get("schedule");

    if(!school && !schedule) return {}
    if(url.searchParams.has("noRedirect")) return {school, schedule};

    if(cookies.get("alwaysRedirect") === "true") throw redirect(302, "/countdown");

    return {school, schedule};
}) satisfies ServerLoad;