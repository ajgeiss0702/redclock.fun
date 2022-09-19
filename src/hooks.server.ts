// @ts-ignore
export async function handleFetch({ request, fetch }) {
    // FIXES: https://github.com/sveltejs/kit/issues/6739
    const rekuest = {
        get(target: Request, prop: string) {
            if (['credentials', 'mode'].includes(prop)) {
                return 'Not Implemented';
            }
            // @ts-ignore
            return target[prop];
        }
    };
    return fetch(new Proxy(request, rekuest));
}