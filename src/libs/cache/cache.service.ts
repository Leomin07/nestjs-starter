import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async reset() {
    await this.cacheManager.reset();
  }

  createKeyCacheData(keyCache: string) {
    const env = this.configService.get('NODE_ENV');
    return `CACHE_${env}_:${keyCache}`;
  }

  async set(keyCache: string, data: any, ttl?: number) {
    return await this.cacheManager.set(keyCache, data, ttl);
  }

  async get(keyCache: string) {
    return await this.cacheManager.get(keyCache);
  }

  async mget(keyCache: string[]) {
    return await (this.cacheManager as any).mget(...keyCache);
  }

  async mset(data: any[]) {
    return await (this.cacheManager as any).mset(...data);
  }

  async del(keyCache: string) {
    return await this.cacheManager.del(keyCache);
  }
}
