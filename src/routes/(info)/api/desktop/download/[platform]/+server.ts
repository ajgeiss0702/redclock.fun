import type {RequestEvent} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

const token = "glpat-sSHP7KNyoCsxc4x1QwYi";

export async function GET({params}: RequestEvent) {
    const platform = params.platform || "";

    if(!platform || !(["win", "linux"].includes(platform))) {
        throw error(400, "Invalid platform");
    }

    const fileName = encodeURIComponent(platform == "win" ? "Red Clock Installer.exe" : "Red Clock Desktop.AppImage");
    const downloadUrl = "https://gitlab.com/api/v4/projects/12062202/jobs/artifacts/master/raw/dist/" + fileName + "?job=build";

    let response = await fetch(downloadUrl, {
        headers: {
            "PRIVATE-TOKEN": token
        }
    })
    let blob = await response.blob();


    return new Response(blob, {
        headers: {
            "Content-Type": response.headers.get("Content-Type") || "application/executable",
            "Content-Disposition": "attachment; filename=" + fileName,
            "Content-Length": String(response.headers.get("Content-Length") || blob.size)
        }
    });
}