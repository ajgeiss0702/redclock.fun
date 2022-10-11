import multiAdapter from '@macfja/svelte-multi-adapter'
import staticAdapter from '@sveltejs/adapter-static';
import nodeAdapter from '@sveltejs/adapter-node';
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: multiAdapter([
			staticAdapter({
				fallback: '400.html'
			}),
			nodeAdapter({
				out: "build-node",
				precompress: true
			})
		]),
		inlineStyleThreshold: 1000
	},
	preprocess: preprocess()
};

export default config;
