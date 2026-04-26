import type { Core } from '@strapi/strapi';
import { envString } from './config-values';

const clientUrl = envString(['CLIENT_URL', 'CMS_CLIENT_URL', 'WEB_PUBLIC_SITE_URL'], 'http://localhost:4321') ??
  'http://localhost:4321';
const publicUrl = envString(['PUBLIC_URL', 'CMS_PUBLIC_URL', 'WEB_PUBLIC_CMS_URL'], 'http://localhost:1337') ??
  'http://localhost:1337';

const config = (): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', clientUrl],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', clientUrl],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [clientUrl, publicUrl],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
