/// <reference types="astro/client" />
/// <reference types="@astrojs/vue/client" />
/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue';

	const component: DefineComponent<Record<string, never>, Record<string, never>, any>;
	export default component;
}

export {};
