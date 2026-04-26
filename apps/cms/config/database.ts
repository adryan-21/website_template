import path from 'path';
import type { Core } from '@strapi/strapi';
import { envBool, envInt, envString } from './config-values';

const config = (): Core.Config.Database => {
  const client = envString(['DATABASE_CLIENT', 'CMS_DATABASE_CLIENT'], 'postgres') ?? 'postgres';

  const connections = {
    mysql: {
      connection: {
        host: envString(['DATABASE_HOST', 'CMS_DATABASE_HOST'], 'localhost') ?? 'localhost',
        port: envInt(['DATABASE_PORT', 'CMS_DATABASE_PORT'], 3306),
        database: envString(['DATABASE_NAME', 'CMS_DATABASE_NAME'], 'strapi') ?? 'strapi',
        user: envString(['DATABASE_USERNAME', 'CMS_DATABASE_USERNAME'], 'strapi') ?? 'strapi',
        password: envString(['DATABASE_PASSWORD', 'CMS_DATABASE_PASSWORD'], 'strapi') ?? 'strapi',
        ssl: envBool(['DATABASE_SSL', 'CMS_DATABASE_SSL'], false) && {
          key: envString(['DATABASE_SSL_KEY', 'CMS_DATABASE_SSL_KEY']),
          cert: envString(['DATABASE_SSL_CERT', 'CMS_DATABASE_SSL_CERT']),
          ca: envString(['DATABASE_SSL_CA', 'CMS_DATABASE_SSL_CA']),
          capath: envString(['DATABASE_SSL_CAPATH', 'CMS_DATABASE_SSL_CAPATH']),
          cipher: envString(['DATABASE_SSL_CIPHER', 'CMS_DATABASE_SSL_CIPHER']),
          rejectUnauthorized: envBool(
            ['DATABASE_SSL_REJECT_UNAUTHORIZED', 'CMS_DATABASE_SSL_REJECT_UNAUTHORIZED'],
            true,
          ),
        },
      },
      pool: {
        min: envInt(['DATABASE_POOL_MIN', 'CMS_DATABASE_POOL_MIN'], 2),
        max: envInt(['DATABASE_POOL_MAX', 'CMS_DATABASE_POOL_MAX'], 10),
      },
    },
    postgres: {
      connection: {
        connectionString: envString(['DATABASE_URL', 'CMS_DATABASE_URL']),
        host: envString(['DATABASE_HOST', 'CMS_DATABASE_HOST'], '127.0.0.1') ?? '127.0.0.1',
        port: envInt(['DATABASE_PORT', 'CMS_DATABASE_PORT'], 5432),
        database: envString(['DATABASE_NAME', 'CMS_DATABASE_NAME'], 'website_template') ?? 'website_template',
        user: envString(['DATABASE_USERNAME', 'CMS_DATABASE_USERNAME'], 'strapi') ?? 'strapi',
        password: envString(['DATABASE_PASSWORD', 'CMS_DATABASE_PASSWORD'], 'strapi') ?? 'strapi',
        ssl: envBool(['DATABASE_SSL', 'CMS_DATABASE_SSL'], false) && {
          key: envString(['DATABASE_SSL_KEY', 'CMS_DATABASE_SSL_KEY']),
          cert: envString(['DATABASE_SSL_CERT', 'CMS_DATABASE_SSL_CERT']),
          ca: envString(['DATABASE_SSL_CA', 'CMS_DATABASE_SSL_CA']),
          capath: envString(['DATABASE_SSL_CAPATH', 'CMS_DATABASE_SSL_CAPATH']),
          cipher: envString(['DATABASE_SSL_CIPHER', 'CMS_DATABASE_SSL_CIPHER']),
          rejectUnauthorized: envBool(
            ['DATABASE_SSL_REJECT_UNAUTHORIZED', 'CMS_DATABASE_SSL_REJECT_UNAUTHORIZED'],
            true,
          ),
        },
        schema: envString(['DATABASE_SCHEMA', 'CMS_DATABASE_SCHEMA'], 'public') ?? 'public',
      },
      pool: {
        min: envInt(['DATABASE_POOL_MIN', 'CMS_DATABASE_POOL_MIN'], 2),
        max: envInt(['DATABASE_POOL_MAX', 'CMS_DATABASE_POOL_MAX'], 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          '..',
          '..',
          envString(['DATABASE_FILENAME', 'CMS_DATABASE_FILENAME'], '.tmp/data.db') ??
            '.tmp/data.db',
        ),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: envInt(
        ['DATABASE_CONNECTION_TIMEOUT', 'CMS_DATABASE_CONNECTION_TIMEOUT'],
        60000,
      ),
    },
  };
};

export default config;
