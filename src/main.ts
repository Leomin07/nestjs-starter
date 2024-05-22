import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { VALIDATION_PIPE_OPTIONS } from './core/constants';
import { RequestIdMiddleware } from './core/middleware/request-id.middleware';
import * as mongoose from 'mongoose';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  /**
   * ConfigService
   */
  const configService = app.get(ConfigService);

  /**
   * Add prefix route
   */
  app.setGlobalPrefix(configService.get('API_V1_STR'));

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);
  app.enableCors();
  app.use(helmet());

  /**
   * Swagger configuration
   */
  const options = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME'))
    .setDescription(configService.get('DESCRIPTION_APP'))
    .setVersion(configService.get('VERSION_APP'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.get('API_DOCS_STR'), app, document);

  const port = configService.get<number>('APP_PORT');
  await app.listen(port);

  /**
   * Mongoose config logging query
   */
  const env = configService.get('NODE_ENV');
  if (env === 'development') {
    mongoose.set('debug', true);
  }

  logger.log(`App running on ${port}`);
}
bootstrap();
