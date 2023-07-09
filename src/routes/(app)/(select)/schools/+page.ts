import type {PageLoad} from "./$types";

export const load = (async ({fetch}) => {
    return fetch("https://ajg0702.us/api/rmf/schedule.php?school=list")
        .then((response) => response.json())
        .catch(e => {
            return {
                "error": {
                    "display": "Error: " + e
                }
            }
        })
}) satisfies PageLoad;