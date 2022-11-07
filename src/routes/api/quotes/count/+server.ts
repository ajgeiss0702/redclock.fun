import { quotes } from "$lib/quotes";

export async function GET() {
    return new Response(quotes.length + "")
}