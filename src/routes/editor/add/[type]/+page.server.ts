import type {PageServerLoad} from "./$types";
import {error} from "@sveltejs/kit";

const validTypes = [
    "school",
    "district"
]


export const load = (async ({locals, params}) => {
    if(locals.user?.id !== 0) throw error(401, "You do not have permissions to create objects")

    const type = params.type;
    if(!type) throw error(400, "No type!");
    if(!validTypes.includes(type)) throw error(404, "Invalid object type!");
}) satisfies PageServerLoad