import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { configModuleOptions } from 'src/core/config/module-option';
import { AllExceptionsFilter } from 'src/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformResponseInterceptor } from 'src/core/interceptors/transform-res.interceptor';
import { AppLogger } from 'src/core/logger/logger.service';
import { LoggerMiddleware } from 'src/core/middleware/logger.middlware';
import { Environment } from 'src/helpers/enum';
import { ClientModule } from './client/client.module';
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
    /*                                  Mongoose                                  */
    /* -------------------------------------------------------------------------- */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        dbName: configService.get('MONGODB_NAME'),
      }),
    }),
    ClientModule,
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
