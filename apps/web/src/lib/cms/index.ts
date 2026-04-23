import { createCmsClient, emptyCmsContent } from '@website-template/cms-sdk';

const fallbackCmsOrigin = 'http://localhost:1338';

const resolveCmsApiUrl = () => {
  const directApiUrl = import.meta.env.CMS_API_URL;

  if (typeof directApiUrl === 'string' && directApiUrl.length > 0) {
    return directApiUrl;
  }

  const publicCmsUrl = import.meta.env.PUBLIC_CMS_URL;

  if (typeof publicCmsUrl === 'string' && publicCmsUrl.length > 0) {
    return `${publicCmsUrl.replace(/\/$/, '')}/api`;
  }

  return `${fallbackCmsOrigin}/api`;
};

const client = createCmsClient({
  apiUrl: resolveCmsApiUrl(),
  fallbackContent: emptyCmsContent,
  token:
    typeof import.meta.env.CMS_API_TOKEN === 'string' && import.meta.env.CMS_API_TOKEN.length > 0
      ? import.meta.env.CMS_API_TOKEN
      : undefined,
});

export const getCmsClient = () => client;

export * from '@website-template/cms-sdk';
