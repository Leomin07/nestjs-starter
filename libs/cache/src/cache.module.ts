import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
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
  providers: [CacheService],
  controllers: [CacheController],
  exports: [CacheService, CacheModule],
})
export class GlobalCacheModule {}
