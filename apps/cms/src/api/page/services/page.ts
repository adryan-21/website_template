import crypto from 'node:crypto';
import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';
import { envInt, envString } from '../../../../config/config-values';

type PagePreviewTokenPayload = {
	path: string;
	locale: string;
	slug: string;
	issuedAt: number;
	expiresAt: number;
};

type PagePreviewTarget = {
	documentId: string;
	locale: string;
	slug: string;
	title: string;
};

type PagePreviewUrlResult = PagePreviewTokenPayload & {
	url: string;
};

type PreviewParams = {
	documentId?: string;
	locale?: string;
	slug?: string;
};

const defaultLocale = 'pl';
const defaultPreviewOrigin = 'http://localhost:4321';
const defaultPreviewTtlSeconds = 15 * 60;

const getPreviewSecret = () => envString(['CMS_PREVIEW_SECRET', 'WEB_PREVIEW_SECRET'], '');

const getPreviewOrigin = () =>
	envString(['WEB_PUBLIC_SITE_URL', 'CLIENT_URL', 'CMS_CLIENT_URL'], defaultPreviewOrigin) ??
	defaultPreviewOrigin;

const getPreviewTtlSeconds = () =>
	envInt(['CMS_PREVIEW_TOKEN_TTL_SECONDS', 'WEB_PREVIEW_TOKEN_TTL_SECONDS'], defaultPreviewTtlSeconds);

const normalizeLocale = (value: unknown): string =>
	typeof value === 'string' && value.trim().length > 0 ? value.trim() : defaultLocale;

const normalizeSlug = (value: unknown): string => {
	if (typeof value !== 'string') {
		return 'home';
	}

	const normalized = value.trim().replace(/^\/+/, '').replace(/\/+$/, '');

	return normalized.length > 0 ? normalized : 'home';
};

const buildLocalizedPath = (locale: string, slug: string): string => {
	const normalizedSlug = normalizeSlug(slug);
	const localePrefix = locale === 'en' ? '/en' : '';

	if (normalizedSlug === 'home') {
		return localePrefix || '/';
	}

	return `${localePrefix}/${normalizedSlug}`;
};

const createSignedToken = (payload: PagePreviewTokenPayload, secret: string): string => {
	const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
	const signature = crypto.createHmac('sha256', secret).update(body).digest('base64url');

	return `${body}.${signature}`;
};

const getText = (value: unknown, fallback = ''): string =>
	typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;

const mapPreviewTarget = (entry: Record<string, unknown> | null, fallbackLocale: string, fallbackSlug: string) => {
	if (!entry) {
		return null;
	}

	const documentId = getText(entry.documentId);

	if (!documentId) {
		return null;
	}

	return {
		documentId,
		locale: getText(entry.locale, fallbackLocale),
		slug: normalizeSlug(entry.slug ?? fallbackSlug),
		title: getText(entry.title, fallbackSlug),
	} satisfies PagePreviewTarget;
};

const findPreviewTarget = async (strapi: Core.Strapi, params: PreviewParams) => {
	const locale = normalizeLocale(params.locale);
	const slug = normalizeSlug(params.slug);
	const documents = strapi.documents('api::page.page');

	if (typeof params.documentId === 'string' && params.documentId.trim().length > 0) {
		const normalizedDocumentId = params.documentId.trim();

		const byDocumentId =
			(await documents.findOne({ documentId: normalizedDocumentId, locale, status: 'draft' })) ??
			(await documents.findOne({ documentId: normalizedDocumentId, locale, status: 'published' })) ??
			(await documents.findOne({ documentId: normalizedDocumentId, status: 'draft' })) ??
			(await documents.findOne({ documentId: normalizedDocumentId, status: 'published' }));

		const mappedByDocumentId = mapPreviewTarget(
			byDocumentId as Record<string, unknown> | null,
			locale,
			slug,
		);

		if (mappedByDocumentId) {
			return mappedByDocumentId;
		}
	}

	const filters = { slug: { $eq: slug } };

	const bySlug =
		(await documents.findFirst({ locale, status: 'draft', filters })) ??
		(await documents.findFirst({ locale, status: 'published', filters })) ??
		(await documents.findFirst({ status: 'draft', filters })) ??
		(await documents.findFirst({ status: 'published', filters }));

	return mapPreviewTarget(bySlug as Record<string, unknown> | null, locale, slug);
};

export default factories.createCoreService('api::page.page', ({ strapi }) => ({
	async getPreviewUrl(params: PreviewParams): Promise<PagePreviewUrlResult | null> {
		const previewSecret = getPreviewSecret();

		if (!previewSecret) {
			throw new Error('Preview mode is not configured. Set CMS_PREVIEW_SECRET and WEB_PREVIEW_SECRET.');
		}

		const target = await findPreviewTarget(strapi, params);

		if (!target) {
			return null;
		}

		const issuedAt = Date.now();
		const expiresAt = issuedAt + getPreviewTtlSeconds() * 1000;
		const payload: PagePreviewTokenPayload = {
			path: buildLocalizedPath(target.locale, target.slug),
			locale: target.locale,
			slug: target.slug,
			issuedAt,
			expiresAt,
		};

		const token = createSignedToken(payload, previewSecret);
		const previewOrigin = getPreviewOrigin().replace(/\/$/, '');

		return {
			...payload,
			url: `${previewOrigin}/api/preview?token=${encodeURIComponent(token)}`,
		};
	},
}));
