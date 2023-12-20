import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { configModuleOptions } from 'src/core/config/module-option';
import { AllExceptionsFilter } from 'src/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { AppLogger } from 'src/core/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
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
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    AppLogger,
  ],
})
export class AppModule {}
