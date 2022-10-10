import adapter from '@sveltejs/adapter-static';
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		inlineStyleThreshold: 1000
	},
	preprocess: preprocess()
};

export default config;
