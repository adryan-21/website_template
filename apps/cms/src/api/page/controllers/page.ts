import { factories } from '@strapi/strapi';
import { envString } from '../../../../config/config-values';

type PreviewUrlInput = {
	documentId?: string;
	locale?: string;
	slug?: string;
};

type PreviewUrlService = {
	getPreviewUrl(input: PreviewUrlInput): Promise<{
		url: string;
		path: string;
		locale: string;
		slug: string;
		issuedAt: number;
		expiresAt: number;
	} | null>;
};

const getPreviewSecret = () => envString(['CMS_PREVIEW_SECRET', 'WEB_PREVIEW_SECRET'], '');

const getQueryValue = (value: unknown): string | undefined => {
	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
};

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
	async previewUrl(ctx) {
		const configuredSecret = getPreviewSecret();

		if (!configuredSecret) {
			return ctx.internalServerError('Preview mode is not configured on the CMS side.');
		}

		const providedSecret = ctx.get('x-preview-secret');

		if (!providedSecret || providedSecret !== configuredSecret) {
			return ctx.unauthorized('Invalid preview secret.');
		}

		const previewService = strapi.service('api::page.page') as PreviewUrlService;
		const result = await previewService.getPreviewUrl({
			documentId: getQueryValue(ctx.query.documentId),
			locale: getQueryValue(ctx.query.locale),
			slug: getQueryValue(ctx.query.slug),
		});

		if (!result) {
			return ctx.notFound('Preview target not found.');
		}

		ctx.body = result;
	},
}));
