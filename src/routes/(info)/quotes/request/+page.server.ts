import {building, dev} from "$app/environment";
import { env } from "$env/dynamic/private";
import { CF_PAGES } from "$env/static/private";
import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";


let vpnIp = "149.28.87.60";
let vpnIpv6 = "2001:19f0:6001:1ca2:5400:3ff:feac:5f2e";

let fs: any;

if(!CF_PAGES) {
    (async () => {
        fs = await import("fs/promises");
        fs.mkdir("quote-requests").then(() => {}).catch(() => {});
    })()
}


export const load = (async ({getClientAddress}) => {
    if(CF_PAGES) throw error(500, "Invalid environment!")
    console.log("got " + getClientAddress())
    let admin = dev || getClientAddress() === vpnIp || getClientAddress() === vpnIpv6;
    let list: string[] = [];
    if(admin) {
        if(!fs) fs = await import("fs/promises");
        list = await fs.readdir("quote-requests")
    }
    return {
        list,
        admin
    }
}) satisfies ServerLoad