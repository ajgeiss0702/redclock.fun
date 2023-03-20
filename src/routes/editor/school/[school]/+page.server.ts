import type {ServerLoad} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {error} from "@sveltejs/kit";

export const load = (async ({params, locals, platform}) => {
    if(!locals.user) return {};

    if(dev) {
        if(params.school == "rmhs") {
            return {
                school: {
                    code: "rmhs",
                    timezone: 420,
                    logo: "https://redclock.fun/img/schools/rmhs.webp",
                    display: "Red Mountain High School",
                    offset: 0
                }
            }
        } else {
            throw error(404, "School not found.")
        }
    }

    if(!platform?.env?.D1DB) {
        throw error(500, "no db!");
    }

    const {results} = (await (
        platform.env.D1DB.prepare("select * from schools where code=?;")
            .bind(params.school)
            .first()
    ));

    if(!results) throw error(404, "School not found.");

    return {
        school: results
    }

}) satisfies ServerLoad