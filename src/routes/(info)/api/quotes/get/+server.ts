import { quotes } from "$lib/quotes";
import {dev} from "$app/environment";

export async function GET() {
    let quoteIndex = dev ? 6 : Math.floor(Math.random() * quotes.length);
    let quote = quotes[quoteIndex];
    return new Response(JSON.stringify({
        ...quote,
        quoteNumber: quoteIndex
    }), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}