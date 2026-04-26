/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="astro/client" />
/// <reference types="@astrojs/vue/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_URL?: string;
	readonly WEB_PUBLIC_SITE_URL?: string;
	readonly PUBLIC_CMS_URL?: string;
	readonly WEB_PUBLIC_CMS_URL?: string;
	readonly CMS_API_URL?: string;
	readonly WEB_CMS_API_URL?: string;
	readonly CMS_API_TOKEN?: string;
	readonly WEB_CMS_API_TOKEN?: string;
	readonly CMS_LOCALE?: string;
	readonly WEB_CMS_LOCALE?: string;
	readonly CMS_CONTENT_STATUS?: 'draft' | 'published';
	readonly WEB_CMS_CONTENT_STATUS?: 'draft' | 'published';
	readonly CONTACT_ENABLED?: string;
	readonly WEB_CONTACT_ENABLED?: string;
	readonly CONTACT_WEBHOOK_URL?: string;
	readonly WEB_CONTACT_WEBHOOK_URL?: string;
	readonly CONTACT_WEBHOOK_SECRET?: string;
	readonly WEB_CONTACT_WEBHOOK_SECRET?: string;
	readonly CONTACT_RATE_LIMIT_WINDOW_MS?: string;
	readonly WEB_CONTACT_RATE_LIMIT_WINDOW_MS?: string;
	readonly CONTACT_RATE_LIMIT_MAX_REQUESTS?: string;
	readonly WEB_CONTACT_RATE_LIMIT_MAX_REQUESTS?: string;
	readonly WEB_PREVIEW_SECRET?: string;
	readonly WEB_PREVIEW_TOKEN_TTL_SECONDS?: string;
	readonly CMS_PREVIEW_SECRET?: string;
	readonly CMS_PREVIEW_TOKEN_TTL_SECONDS?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module '*.vue' {
	import type { DefineComponent } from 'vue';

	const component: DefineComponent<Record<string, never>, Record<string, never>, any>;
	export default component;
}

export {};
