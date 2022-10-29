import { getAPIPrefix } from "$lib/utils";
import type {LoadEvent} from "@sveltejs/kit";

export async function load({fetch}: LoadEvent) {
    return {
        lastUpdate: await fetch(getAPIPrefix() + "/api/desktop/lastUpdate").then(r => r.text())
    }
}