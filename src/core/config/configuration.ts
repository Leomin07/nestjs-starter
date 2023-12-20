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
  },
});
