import multiAdapter from '@macfja/svelte-multi-adapter'
import staticAdapter from '@sveltejs/adapter-static';
import nodeAdapter from '@sveltejs/adapter-node';
import cfAdapter from '@sveltejs/adapter-cloudflare';
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: multiAdapter([
			staticAdapter({
				fallback: '404.html'
			}),
			nodeAdapter({
				out: "build-node",
				precompress: true
			}),
			cfAdapter()
		]),
		inlineStyleThreshold: 1000
	},
	preprocess: preprocess()
};

export default config;
