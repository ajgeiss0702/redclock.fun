import type {ServerLoad} from "@sveltejs/kit";

export const load = (async ({ cookies, fetch, url}) => {

    const school = url.searchParams.get("school") ?? cookies.get("school") ;
    const schedule = url.searchParams.get("schedule") ?? cookies.get("schedule");

    let startTime;
    if(school && schedule) {
        startTime = await (
            fetch("/api/countdown/" + school + "/" + schedule + "/json")
                .then(r => r.json())
        )
    }

    return {
        startTime,
        school,
        schedule
    };
}) satisfies ServerLoad;