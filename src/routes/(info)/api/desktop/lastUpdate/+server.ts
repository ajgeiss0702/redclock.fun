
const token = "glpat-qzcyzKYsWqTX2CzgP-uu";

let cache: string;
let lastGet = 0;
export const prerender = true;

export async function GET() {
    if(building) return {lastUpdate: "2024-08-22T14:30:42.000-07:00"}

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
            "Access-Control-Allow-Origin": "*",
            "content-type": "text/plain"
        }
    });
}