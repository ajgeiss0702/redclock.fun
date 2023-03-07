import { quotes } from "$lib/quotes";
import type {RequestEvent} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";



export async function GET({params}: RequestEvent) {
    let quoteIndex = Number(params.quoteNumber);
    if(isNaN(quoteIndex)) {
        throw error(400, "Invalid quote number")
    }
    let quote = quotes[quoteIndex];
    if(typeof quote == "undefined") {
        throw error(404, "Quote not found");
    }
    return new Response(JSON.stringify({
        ...quote,
        quoteNumber: quoteIndex
    }), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}