import { getAPIPrefix } from "$lib/utils";
import type {LoadEvent} from "@sveltejs/kit";

export async function load({fetch}: LoadEvent) {
    return {
        lastUpdate: await fetch(getAPIPrefix(false) + "/api/desktop/lastUpdate").then(r => r.text()).catch(e => {
            console.log("Error while fetching lastUpdate: " + e);
            return 0;
        })
    }
}