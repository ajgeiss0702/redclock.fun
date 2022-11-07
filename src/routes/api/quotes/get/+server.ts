import { quotes } from "$lib/quotes";



export async function GET() {
    let quoteIndex = Math.floor(Math.random() * quotes.length);
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