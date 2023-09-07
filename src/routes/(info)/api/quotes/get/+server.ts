import {json} from "@sveltejs/kit";
import {getQuote} from "$lib/quoteGetter";

export async function GET() {


    return json(await getQuote())
}