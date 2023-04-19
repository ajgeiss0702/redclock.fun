import {dev} from "$app/environment";
import type {ServerLoad} from "@sveltejs/kit";


let vpnIp = "149.28.87.60";

export const load = (async ({getClientAddress}) => {
    console.log("got " + getClientAddress())
    let admin = dev || getClientAddress() === vpnIp;
    return {admin}
}) satisfies ServerLoad