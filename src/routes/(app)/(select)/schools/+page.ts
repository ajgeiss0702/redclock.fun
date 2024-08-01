import type {PageLoad} from "./$types";

export const load = (async ({fetch}) => {
    return fetch("https://temp-schedules.redclock.fun/schedule.php?school=list")
        .then((response) => response.json())
        .catch(e => {
            return {
                "error": {
                    "display": "Error: " + e
                }
            }
        })
}) satisfies PageLoad;