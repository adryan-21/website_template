// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

const site = process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
	site,
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [vue(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
	},
});
