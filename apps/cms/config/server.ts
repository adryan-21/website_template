import type { Core } from '@strapi/strapi';
import { envArray, envBool, envInt, envString } from './config-values';

const config = (): Core.Config.Server => ({
  host: envString(['HOST', 'CMS_HOST'], '0.0.0.0') ?? '0.0.0.0',
  port: envInt(['PORT', 'CMS_PORT'], 1337),
  url: envString(['PUBLIC_URL', 'CMS_PUBLIC_URL', 'WEB_PUBLIC_CMS_URL'], 'http://localhost:1337') ?? 'http://localhost:1337',
  proxy: envBool(['IS_PROXIED', 'CMS_IS_PROXIED'], false),
  app: {
    keys: envArray(['APP_KEYS', 'CMS_APP_KEYS']),
  },
});

export default config;
