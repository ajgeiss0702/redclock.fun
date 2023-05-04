import { quotes } from "$lib/quotes";
import {dev} from "$app/environment";
import {json} from "@sveltejs/kit";

export async function GET() {

    const now = new Date();
    if(now.getDate() == 4 && now.getMonth() == 4 && Math.floor(Math.random() * 20) == 0) {
        return json({
            quote: "May the Fourth Be With You!",
            author: "George Lucas",
            request: "ab9badad-0806-4805-945c-2724f5788f92"
        })
    }

    let quoteIndex = dev ? 224 : Math.floor(Math.random() * quotes.length);
    let quote = quotes[quoteIndex];
    return json({
        ...quote,
        quoteNumber: quoteIndex
    })
}