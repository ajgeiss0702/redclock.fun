import {dev} from "$app/environment";
import type {ServerLoad} from "@sveltejs/kit";


let vpnIp = "149.28.87.60";
let vpnIpv6 = "2001:19f0:6001:1ca2:5400:3ff:feac:5f2e";

export const load = (async ({getClientAddress}) => {
    console.log("got " + getClientAddress())
    let admin = dev || getClientAddress() === vpnIp || getClientAddress() === vpnIpv6;
    return {admin}
}) satisfies ServerLoad