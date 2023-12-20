import * as Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './configuration';
import { join } from 'path';

export const configModuleOptions: ConfigModuleOptions = {
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    APP_PORT: Joi.number().required(),
    CACHE_MAX: Joi.number().required(),
    CACHE_TTL: Joi.number().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    REDIS_USERNAME: Joi.string().required(),
    MONGO_URI: Joi.string().required(),
  }),
  load: [configuration],
  validationOptions: {
    abortEarly: false,
  },
  isGlobal: true,
  cache: true,
  expandVariables: true,
  envFilePath: [join(process.cwd(), '/apps/app/.env')],
};
