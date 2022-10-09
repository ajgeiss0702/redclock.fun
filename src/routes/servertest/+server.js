export const prerender = false;
export function get({ url }) {
    return new Response(String(new Date().getTime()))
}