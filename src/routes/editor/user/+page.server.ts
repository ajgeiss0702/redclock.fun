import type {Actions} from "./$types";
import {dev} from "$app/environment";
import {error, fail} from "@sveltejs/kit";


export const actions = ({
    default: async ({platform, request, locals}) => {
        const db = platform?.env?.D1DB as D1Database;
        if(!locals.user) return fail(401, {message: "Not logged in!"});

        if(!db) {
            if(dev) return;
            throw error(503, "Users DB not available!");
        }

        const data = await request.formData();
        const name = data.get("name");
        const wantCreditString = data.get("want-credit");

        if(!name || !wantCreditString) throw fail(400, {blank: true});

        await db.prepare("update users set name=?, wantsCredit=? where id=?")
            .bind(name, wantCreditString == "true" ? 1 : 0, locals.user.id)
            .run()
    }
}) satisfies Actions