import {error, json, type RequestEvent} from "@sveltejs/kit";
import {dev} from "$app/environment";

const cacheTime = 60e3; // cache responses from DO for 1 minute

let cache: {
    [key: string]: {
        lastFetch: number,
        lastData?: object
    }
} = {};

export async function GET({params, platform}: RequestEvent) {

    const schoolCode = params.school;

    if(!schoolCode) throw error(400, "No school provided");

    if(!cache[schoolCode]) cache[schoolCode] = {lastFetch: 0};

    const lastFetch = cache[schoolCode]?.lastFetch || 0;

    if(Date.now() - lastFetch < cacheTime) {
        return json({
            edgeCache: true,
            edgeLastFetch: lastFetch,
            ...(cache[schoolCode].lastData)
        });
    }

    cache[schoolCode].lastFetch = Date.now();

    const durable = platform?.env?.DURABLE;

    let stub: DurableObjectStub;
    if(durable) {
        const id = durable.idFromName("youtube");
        stub = durable.get(id, {locationHint: 'wnam'});
    } else if(dev) {
        stub = {fetch} as unknown as DurableObjectStub;
    } else {
        throw error(503, "Fetcher not available");
    }

    if(dev) console.log("Fetching from DO!")

    const response = await stub.fetch("https://redclock-durable.ajg.workers.dev/weather/" + schoolCode).then(r => r.json()) as object;
    cache[schoolCode].lastData = response;

    return json(response);

}