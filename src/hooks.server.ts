import type {Handle} from "@sveltejs/kit";
import {getUserFromSession} from "./lib/server/users";

export const handle: Handle = async ({ event, resolve }) => {

    if(event.platform?.env?.FUNC_ANAL) {
        event.platform?.env?.FUNC_ANAL.writeDataPoint({
            blobs: [event.url.pathname],
            doubles: [],
            indexes: []
        })
    }

    if(event.url.pathname.startsWith("/editor")) {
        event.locals.user = await getUserFromSession(event?.platform?.env, event.cookies.get("session"))
    }


    const response = await resolve(event);


    if(event.url.pathname.startsWith("/api")) {
        response.headers.set("Access-Control-Allow-Origin", "*");
    }

    return response;
}