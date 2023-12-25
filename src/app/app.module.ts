import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { configModuleOptions } from 'src/core/config/module-option';
import { AllExceptionsFilter } from 'src/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformResponseInterceptor } from 'src/core/interceptors/transform-res.interceptor';
import { AppLogger } from 'src/core/logger/logger.service';
import { LoggerMiddleware } from 'src/core/middleware/logger.middlware';
import { Notification } from 'src/database/entities/Notification';
import { NotificationMember } from 'src/database/entities/NotificationMemeber';
import { User } from 'src/database/entities/User';
import { Environment } from 'src/helpers/enum';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    /* -------------------------------------------------------------------------- */
    /*                                Cache module                                */
    /* -------------------------------------------------------------------------- */
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        isGlobal: true,
        ttl: configService.get('CACHE_TTL'),
        store: redisStore,
      }),
    }),
    /* -------------------------------------------------------------------------- */
    /*                                Bullmq module                               */
    /* -------------------------------------------------------------------------- */
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    /* -------------------------------------------------------------------------- */
    /*                                   Typeorm                                   */
    /* -------------------------------------------------------------------------- */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USERNAME'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DATABASE'),
        entities: [User, Notification, NotificationMember],
        synchronize: false,
        logging: configService.get('NODE_ENV') !== Environment.Production,
      }),
    }),
  ],
  /* -------------------------------------------------------------------------- */
  /*                                  Providers                                 */
  /* -------------------------------------------------------------------------- */
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    AppLogger,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const env = this.configService.get<Environment>('env');

    if (!['production', 'prd'].includes(env)) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
