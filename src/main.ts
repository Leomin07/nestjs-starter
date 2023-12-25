import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { VALIDATION_PIPE_OPTIONS } from './core/constants';
import { RequestIdMiddleware } from './core/middleware/request-id.middleware';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('API_V1_STR'));

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);
  app.enableCors();

  /** Swagger configuration*/
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

  logger.log(`App running on ${port}`);
}
bootstrap();
