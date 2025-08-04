import { getAPIPrefix } from "$lib/utils";
import type {LoadEvent} from "@sveltejs/kit";
import {building} from "$app/environment";

export async function load({fetch}: LoadEvent) {
    if(building) return {lastUpdate: "2024-08-22T14:30:42.000-07:00"}
    return {
        lastUpdate: await fetch(getAPIPrefix(false) + "/api/desktop/lastUpdate").then(r => r.text()).catch(e => {
            console.log("Error while fetching lastUpdate: " + e);
            return 0;
        })
    }
}