import type {Actions} from "@sveltejs/kit";
import {fail} from "@sveltejs/kit";

export const actions = {
    offset: (async ({locals, request, platform, params}) => {
        if(!locals.user) return fail(401);

        const formData = await request.formData();
        const offset = Number(formData.get("offset"));

        if(isNaN(offset)) return fail(400, {message: "Missing new offset!"});

        const schools = platform?.env?.SCHOOLS;
        if(!schools) return fail(500, {message: "Missing database!"})

        const {value, metadata} = await schools.getWithMetadata(params.school, {type: "json"});

        if(!value) return fail(500, {message: "School doesnt exist?"})

        await schools.put(params.school, value, {
            metadata: {
                ...metadata,
                offset: offset
            }
        })
    })
} satisfies Actions