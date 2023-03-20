import type {ServerLoad} from "@sveltejs/kit";
import {redirect} from "@sveltejs/kit";

export const load = (async ({url, locals}) => {
    if(url.pathname !== "/editor" && !url.pathname.startsWith("/editor/auth") && !locals.user) {
        throw redirect(302, "/editor/auth/signin?to=" + encodeURIComponent(url.pathname));
    }

    return {user: locals.user}
}) satisfies ServerLoad;