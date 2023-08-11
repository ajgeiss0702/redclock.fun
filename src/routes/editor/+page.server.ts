import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import {getPermissions} from "../../lib/server/users";

export const load = (async ({locals, platform}) => {
    const user = locals.user
    if(!user) return {};

    const schools = platform?.env?.SCHOOLS;
    const districts = platform?.env?.DISTRICTS;

    if(!schools || !districts) {
        throw error(500, "Missing school or district KV!");
    }

    const schoolList = schools.list()
        .then(response => response.keys)
        .then(async (keys) => {
            const permissions = await getPermissions(platform.env, user.id);
            return keys.filter(school =>
                !school.name.includes("backup") &&
                (
                    permissions.includes("*") ||
                    permissions.includes("school.*") ||
                    permissions.includes("school." + school.name)
                )
            );
        });
    const districtList = districts.list()
        .then(response => response.keys)
        .then(async (keys) => {
            const permissions = await getPermissions(platform.env, user.id);
            return keys.filter(district =>
                !district.name.includes("backup") &&
                (
                    permissions.includes("*") ||
                    permissions.includes("district.*") ||
                    permissions.includes("district." + district.name)
                )
            );
        });

    return {
        schools: await schoolList,
        districts: await districtList
    }
    
}) satisfies ServerLoad