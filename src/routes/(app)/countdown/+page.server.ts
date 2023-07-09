import type {ServerLoad} from "@sveltejs/kit";

export const load = (async ({ cookies, fetch, url}) => {

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