import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as Joi from 'joi';
import { join } from 'path';
import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    APP_PORT: Joi.number().required(),
    APP_NAME: Joi.string().required(),
    VERSION_APP: Joi.string().required(),
    DESCRIPTION_APP: Joi.string().required(),
    API_V1_STR: Joi.string().required(),
    API_DOCS_STR: Joi.string().required(),
    SALT_OR_ROUNDS: Joi.number().required(),
    CACHE_MAX: Joi.number().required(),
    CACHE_TTL: Joi.number().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    MYSQL_USERNAME: Joi.string().required(),
    MYSQL_PASSWORD: Joi.string().required(),
    MYSQL_DATABASE: Joi.string().required(),
    MYSQL_PORT: Joi.number().required(),
    MYSQL_HOST: Joi.string().required(),
    ONESIGNAL_APP_ID: Joi.string().required(),
    ONESIGNAL_REST_API_KEY: Joi.string().required(),
    ONESIGNAL_USER_KEY: Joi.string().required(),
    JWT_SECRET_KEY: Joi.string().required(),
    JWT_ALGORITHMS: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
    JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
    JWT_REGISTER_TOKEN_EXPIRES_IN: Joi.number().required(),
    REQUEST_VERIFICATION_CODE_TTL: Joi.number().required(),
    REQUEST_VERIFICATION_CODE_LIMIT: Joi.number().required(),
    DELAY_BETWEEN_RETRY: Joi.number().required(),
    VERIFY_CODE_TTL: Joi.number().required(),
    CONFIG_RETRY_BLOCK: Joi.number().required(),
    THROTTLE_LIMIT: Joi.number().required(),
    THROTTLE_TTL: Joi.number().required(),
    MONGODB_URI: Joi.string().required(),
    MONGODB_NAME: Joi.string().required(),
  }),
  load: [configuration],
  validationOptions: {
    abortEarly: false,
  },
  isGlobal: true,
  cache: true,
  expandVariables: true,
  envFilePath: [join(process.cwd(), '.env')],
};
