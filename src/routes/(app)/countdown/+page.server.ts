import type {ServerLoad} from "@sveltejs/kit";

export const load = (async ({ cookies, fetch }) => {

    let startTime;
    if(cookies.get("school") && cookies.get("schedule")) {
        startTime = await (
            fetch("/api/countdown/" + cookies.get("school") + "/" + cookies.get("schedule") + "/json")
                .then(r => r.json())
        )
    }

    return {
        startTime
    };
}) satisfies ServerLoad;