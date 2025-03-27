import {GITLAB_DESKTOP_ACCESS_TOKEN} from "$env/static/private"

const token = GITLAB_DESKTOP_ACCESS_TOKEN;

let cache: string;
let lastGet = 0;
export const prerender = true;

export async function GET() {

    let r;

    if(Date.now() - lastGet >= 10 * 60 * 1e3) {
        let jobs = await fetch("https://gitlab.com/api/v4/projects/12062202/jobs/", {
            headers: {
                "PRIVATE-TOKEN": token
            }
        }).then(r => r.json()).catch(e => {
            console.log(e);
            throw e;
        });
        r = jobs[0].commit.created_at;
        cache = r;
        lastGet = Date.now();
    } else {
        r = cache;
    }

    return new Response(r, {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
}