import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(process.cwd(), '.env'),
});

export default (): any => ({
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: process.env.APP_PORT,
  APP_NAME: process.env.APP_NAME,
  VERSION_APP: process.env.VERSION_APP,
  DESCRIPTION_APP: process.env.DESCRIPTION_APP,
  API_V1_STR: process.env.API_V1_STR,
  API_DOCS_STR: process.env.API_DOCS_STR,
  SALT_OR_ROUNDS: process.env.SALT_OR_ROUNDS,
  AUTH: {
    REQUEST_VERIFICATION_CODE_LIMIT:
      process.env.REQUEST_VERIFICATION_CODE_LIMIT,
    REQUEST_VERIFICATION_CODE_TTL: process.env.REQUEST_VERIFICATION_CODE_TTL,
    DELAY_BETWEEN_RETRY: process.env.DELAY_BETWEEN_RETRY,
    VERIFY_CODE_TTL: process.env.VERIFY_CODE_TTL,
    CONFIG_RETRY_BLOCK: process.env.CONFIG_RETRY_BLOCK,
  },
  CACHE: {
    CACHE_MAX: process.env.CACHE_MAX,
    CACHE_TTL: process.env.CACHE_TTL,
  },
  REDIS: {
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_URL: process.env.REDIS_URL,
  },
  PG: {
    PG_USERNAME: process.env.PG_USERNAME,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_DATABASE_NAME: process.env.PG_DATABASE_NAME,
    PG_PORT: process.env.PG_PORT,
    PG_HOST: process.env.PG_HOST,
  },
  ONESIGNAL: {
    ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
    ONESIGNAL_REST_API_KEY: process.env.ONESIGNAL_REST_API_KEY,
    ONESIGNAL_USER_KEY: process.env.ONESIGNAL_USER_KEY,
  },
  JWT: {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_ALGORITHMS: process.env.JWT_ALGORITHMS,
    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_REGISTER_TOKEN_EXPIRES_IN: process.env.JWT_REGISTER_TOKEN_EXPIRES_IN,
  },
});
