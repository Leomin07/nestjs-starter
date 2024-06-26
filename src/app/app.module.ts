import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleOptions } from 'src/core/config/module-option';
import { AllExceptionsFilter } from 'src/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformResponseInterceptor } from 'src/core/interceptors/transform-res.interceptor';
import { AppLogger } from 'src/core/logger/logger.service';
import { LoggerMiddleware } from 'src/core/middleware/logger.middlware';
import { Environment } from 'src/helpers/enum';
import { JwtAuthenticationModule } from 'src/libs/jwt-authentication/jwt-authentication.module';
import { GlobalCacheModule } from '../libs/cache/cache.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    /* -------------------------------------------------------------------------- */
    /*                               ScheduleModule                               */
    /* -------------------------------------------------------------------------- */
    ScheduleModule.forRoot(),
    /* -------------------------------------------------------------------------- */
    /*                               ThrottlerModule                              */
    /* -------------------------------------------------------------------------- */
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [
        {
          ttl: configService.get('THROTTLE_TTL'),
          limit: configService.get('THROTTLE_LIMIT'),
        },
      ],
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
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get('NODE_ENV') !== Environment.Production,
      }),
    }),
    JwtAuthenticationModule,
    AuthModule,
    GlobalCacheModule,
  ],
  /* -------------------------------------------------------------------------- */
  /*                                  Providers                                 */
  /* -------------------------------------------------------------------------- */
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppLogger,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const env = this.configService.get<Environment>('NODE_ENV');

    if (!['production', 'prd'].includes(env)) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
