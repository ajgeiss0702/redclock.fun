import type {Actions} from "./$types";
import {dev} from "$app/environment";
import {error, fail} from "@sveltejs/kit";


export const actions = ({
    default: async ({platform, request}) => {
        const db = platform?.env?.D1DB as D1Database;

        if(!db) {
            if(dev) return;
            throw error(503, "Users DB not available!");
        }

        const data = await request.formData();
        const name = data.get("name");
        const wantCreditString = data.get("want-credit");

        if(!name || !wantCreditString) throw fail(400, {blank: true});

        await db.prepare("update users set name=?, wantsCredit=?")
            .bind(name, wantCreditString == "true")
            .run()
    }
}) satisfies Actions