import {
  createCmsClient,
  emptyCmsContent,
  type CmsClientOptions,
  type CmsDocumentStatus,
} from '@website-template/cms-sdk';

const fallbackCmsOrigin = 'http://localhost:1338';

const getEnvValue = (...keys: string[]) => {
  for (const key of keys) {
    const value = import.meta.env[key as keyof ImportMetaEnv];

    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return undefined;
};

const resolveCmsApiUrl = () => {
  const directApiUrl = getEnvValue('CMS_API_URL', 'WEB_CMS_API_URL');

  if (typeof directApiUrl === 'string' && directApiUrl.length > 0) {
    return directApiUrl;
  }

  const publicCmsUrl = getEnvValue('PUBLIC_CMS_URL', 'WEB_PUBLIC_CMS_URL');

  if (typeof publicCmsUrl === 'string' && publicCmsUrl.length > 0) {
    return `${publicCmsUrl.replace(/\/$/, '')}/api`;
  }

  return `${fallbackCmsOrigin}/api`;
};

const resolveDefaultStatus = (): CmsDocumentStatus => {
  return getEnvValue('CMS_CONTENT_STATUS', 'WEB_CMS_CONTENT_STATUS') === 'draft'
    ? 'draft'
    : 'published';
};

const createDefaultClientOptions = (): CmsClientOptions => ({
  apiUrl: resolveCmsApiUrl(),
  fallbackContent: emptyCmsContent,
  locale: getEnvValue('CMS_LOCALE', 'WEB_CMS_LOCALE'),
  status: resolveDefaultStatus(),
  token: getEnvValue('CMS_API_TOKEN', 'WEB_CMS_API_TOKEN'),
});

export const getCmsClient = (options: Partial<CmsClientOptions> = {}) => {
  const defaults = createDefaultClientOptions();

  return createCmsClient({
    ...defaults,
    ...options,
    locale: options.locale ?? defaults.locale,
    status: options.status ?? defaults.status,
  });
};

export * from '@website-template/cms-sdk';
