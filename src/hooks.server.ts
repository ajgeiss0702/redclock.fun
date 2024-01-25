import type {Handle} from "@sveltejs/kit";
import {getUserFromSession} from "./lib/server/users";
import {building, dev} from "$app/environment";

export const handle: Handle = async ({ event, resolve }) => {


    // KV in dev
    if (dev) {
        const { fallBackPlatformToMiniFlareInDev } = await import('$lib/clients/miniflare');
        event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
    }

    const url = event.url;
    const cookies = event.cookies;


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

    if(!building && (url.pathname == "/countdown" || url.pathname == "/lightweight")) {
        const school = url.searchParams.get("school") ?? cookies.get("school") ;
        const schedule = url.searchParams.get("schedule") ?? cookies.get("schedule");

        const set = url.searchParams.get("set") === "";
        if(set && school && schedule) {
            const expires = new Date();
            expires.setDate(expires.getDate() + 3650);

            const options = {
                expires,
                path: "/"
            }

            cookies.set("school", school, options);
            cookies.set("schedule", schedule, options);
        }

        event.params.__c_school = school;
        event.params.__c_schedule = schedule;
    }

    if(event.platform) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        event.platform = {
            ...event.platform,
            env: {
                ...event.platform.env,
                SESSION_STORE: createKVNamespaceWrapper(event.platform.env?.SESSION_STORE, "session_store", event.platform),
                CACHE: createKVNamespaceWrapper(event.platform.env?.CACHE, "cache", event.platform),
                SCHOOLS: createKVNamespaceWrapper(event.platform.env?.SCHOOLS, "schools", event.platform),
                DISTRICTS: createKVNamespaceWrapper(event.platform.env?.DISTRICTS, "districts", event.platform),
                QUOTE_SUGGESTIONS: createKVNamespaceWrapper(event.platform.env?.QUOTE_SUGGESTIONS, "quote_suggestions", event.platform),
            }
        }
    }


    const resolveStart = Date.now();

    const response = await resolve(event);

    timings.push({
        id: "resolve",
        duration: Date.now() - resolveStart
    })


    if(url.pathname.startsWith("/api")) {
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


function createKVNamespaceWrapper(real: KVNamespace, kvNamespaceName: string, realPlatform: App.Platform): KVNamespace {
    const analytics: AnalyticsEngineDataset | undefined = realPlatform.env?.KV_ANALYTICS;
    if(!real) return real;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return {
        delete(key: string): Promise<void> {
            analytics?.writeDataPoint({blobs: [kvNamespaceName, "DELETE", key, `DELETE ${kvNamespaceName}/${key}`]});
            return real.delete(key);
        },
        list<Metadata>(options: KVNamespaceListOptions | undefined): Promise<KVNamespaceListResult<Metadata, string>> {
            analytics?.writeDataPoint({blobs: [kvNamespaceName, "LIST", null, `LIST ${kvNamespaceName}`]});
            return real.list(options);
        },
        put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options: KVNamespacePutOptions | undefined): Promise<void> {
            analytics?.writeDataPoint({blobs: [kvNamespaceName, "PUT", key, `PUT ${kvNamespaceName}/${key}`]});
            return real.put(key, value, options);
        },
        get(key: string, options?: KVNamespaceGetOptions<never>): Promise<string | null> {
            analytics?.writeDataPoint({blobs: [kvNamespaceName, "GET", key, `GET ${kvNamespaceName}/${key}`]});
            return real.get(key, options);
        },
        getWithMetadata(key: string, options?: KVNamespaceGetOptions<never>): any {
            analytics?.writeDataPoint({blobs: [kvNamespaceName, "GETwMETA", key, `GETwMETA ${kvNamespaceName}/${key}`]});
            return real.getWithMetadata(key, options);
        }

    }
}