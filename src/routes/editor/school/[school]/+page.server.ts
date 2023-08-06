import type {Actions} from "@sveltejs/kit";
import {fail} from "@sveltejs/kit";

export const actions = {
    offset: (async ({locals, request, platform, params}) => {
        if(!locals.user) return fail(401);
        if(!params.school) return fail(400, {message: "Missing school parameter"});

        const formData = await request.formData();
        const offset = Number(formData.get("offset"));

        if(isNaN(offset)) return fail(400, {message: "Missing new offset!"});

        const schools = platform?.env?.SCHOOLS;
        if(!schools) return fail(500, {message: "Missing database!"})

        const {value, metadata} = await schools.getWithMetadata<unknown, EditorSchool>(params.school, {type: "json"});

        if(!value) return fail(500, {message: "School doesnt exist?"})

        await schools.put(params.school, JSON.stringify(value), {
            metadata: {
                ...metadata,
                offset: offset
            }
        })
    })
} satisfies Actions