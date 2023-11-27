import type {QuoteRequestMetadata} from "$lib/quoteSettings";

export async function updatePendingCount(kv: KVNamespace) {
    if(!kv) throw new Error("Missing quotes kv!");

    let count = 0;

    // @ts-ignore because for some reason cursor cant be found even though its in the type definition
    let {keys, list_complete, cursor} = (await kv.list<QuoteRequestMetadata>());

    count += keys.filter(k => k.metadata?.status === "pending").length

    let i = 0;
    while(!list_complete && i < 501) {
        let more = await kv.list<QuoteRequestMetadata>({cursor});
        count += more.keys.filter(k => k.metadata?.status === "pending").length;
        list_complete = more.list_complete;
        // @ts-ignore
        cursor = more.cursor;
        i++;
    }

    await kv.put("count", count+"");

}