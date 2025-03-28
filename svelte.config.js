import multiAdapter from "@macfja/svelte-multi-adapter";
import staticAdapter from "@sveltejs/adapter-static";
import nodeAdapter from "@sveltejs/adapter-node";
import cfAdapter from "@sveltejs/adapter-cloudflare";
import vercelAdapter from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: multiAdapter([
      staticAdapter({
        fallback: "404.html",
      }),
      nodeAdapter({
        out: "build-node",
        precompress: true,
      }),
      cfAdapter({
        routes: {
          include: [
            "/api/*",
            "/editor/*",
            "/",
            "/__data.json",
            "/countdown",
            "/countdown/__data.json",
            "/quotes/request/*",
            "/schools",
            "/schedules"
          ],
          exclude: [
            "/api/schedule.php",
            "/api/search",
            "/api/.env"
          ],
        },
      }),
      vercelAdapter({
        edge: true,
        split: true,
        external: ["fs/promises"]
      }),
    ]),
    inlineStyleThreshold: 1000,
    version: {
      name: (await import('child_process'))
          .execSync('git rev-parse HEAD')
          .toString().trim()
    }
  },
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
