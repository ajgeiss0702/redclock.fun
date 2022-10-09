export const prerender = false;
export function GET({ url }) {
    return new Response(String(new Date().getTime()))
}