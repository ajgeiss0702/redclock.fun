import type {Handle} from "@sveltejs/kit";
import {getUserFromSession} from "./lib/server/users";
import {dev} from "$app/environment";

export const handle: Handle = async ({ event, resolve }) => {


    // KV in dev
    if (dev) {
        const { fallBackPlatformToMiniFlareInDev } = await import('$lib/clients/miniflare');
        event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
    }


    if(event.platform?.env?.FUNC_ANAL) {
        event.platform?.env?.FUNC_ANAL.writeDataPoint({
            blobs: [event.url.pathname],
            doubles: [],
            indexes: []
        })
    }

    const timings: TimingEntry[] = [];

    event.locals.addTiming = (timing: TimingEntry) => {
        timings.push(timing)
    }

    if(event.url.pathname.startsWith("/editor") || event.url.pathname.startsWith("/quotes")) {
        let sessionRead = Date.now();

        event.locals.user = await getUserFromSession(event?.platform?.env, event.cookies.get("session"))

        timings.push({
            id: "sessionRead",
            duration: Date.now() - sessionRead
        })
    }



    const resolveStart = Date.now();

    const response = await resolve(event);

    timings.push({
        id: "resolve",
        duration: Date.now() - resolveStart
    })


    if(event.url.pathname.startsWith("/api")) {
        response.headers.set("Access-Control-Allow-Origin", "*");
    }


    if(timings.length > 0) {
        const timingStrings: string[] = [];

        for (const timing of timings) {
            if(timing.description) {
                timingStrings.push(
                    timing.id + ";" +
                    "desc=\"" + timing.description + "\";" +
                    "dur=" + timing.duration
                );
            } else {
                timingStrings.push(
                    timing.id + ";" +
                    "dur=" + timing.duration
                );
            }
        }

        response.headers.append("Server-Timing", timingStrings.join(","));
    }

    return response;
}