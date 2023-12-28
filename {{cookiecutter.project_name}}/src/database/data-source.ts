import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: configService.get('PG_HOST'),
  port: configService.get('PG_PORT'),
  username: configService.get('PG_USERNAME'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_DATABASE_NAME'),
  entities: ['dist/database/entities/*{.js,.ts}'],
  migrations: ['dist/database/migrations/*{.js,.ts}'],
  synchronize: false,
});
