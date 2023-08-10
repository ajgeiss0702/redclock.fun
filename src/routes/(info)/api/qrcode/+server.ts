import type {RequestHandler} from "@sveltejs/kit";
import QRCode from 'qrcode';


export const GET = (async ({url}) => {
    const text = url.searchParams.get("text") ?? "https://redclock.fun"
    const image = await QRCode.toString(text, {type: "svg"});

    return new Response(image, {
        headers: {
            "content-type": "image/svg+xml",
            "content-length": image.length+""
        }
    });
}) satisfies RequestHandler;