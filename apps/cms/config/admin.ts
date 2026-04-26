import type { Core } from '@strapi/strapi';
import { envBool, envString } from './config-values';

const config = (): Core.Config.Admin => ({
  auth: {
    secret: envString(['ADMIN_JWT_SECRET', 'CMS_ADMIN_JWT_SECRET']) ?? '',
  },
  apiToken: {
    salt: envString(['API_TOKEN_SALT', 'CMS_API_TOKEN_SALT']) ?? '',
  },
  transfer: {
    token: {
      salt: envString(['TRANSFER_TOKEN_SALT', 'CMS_TRANSFER_TOKEN_SALT']) ?? '',
    },
  },
  secrets: {
    encryptionKey: envString(['ENCRYPTION_KEY', 'CMS_ENCRYPTION_KEY']) ?? '',
  },
  flags: {
    nps: envBool(['FLAG_NPS', 'CMS_FLAG_NPS'], true),
    promoteEE: envBool(['FLAG_PROMOTE_EE', 'CMS_FLAG_PROMOTE_EE'], true),
  },
});

export default config;
