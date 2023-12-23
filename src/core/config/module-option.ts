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
    CACHE_MAX: Joi.number().required(),
    CACHE_TTL: Joi.number().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    PG_USERNAME: Joi.string().required(),
    PG_PASSWORD: Joi.string().required(),
    PG_DATABASE_NAME: Joi.string().required(),
    PG_PORT: Joi.number().required(),
    ONESIGNAL_APP_ID: Joi.string().required(),
    ONESIGNAL_REST_API_KEY: Joi.string().required(),
    ONESIGNAL_USER_KEY: Joi.string().required(),
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
