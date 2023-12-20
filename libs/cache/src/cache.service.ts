import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async resetAllCaches(): Promise<void> {
    await this.cacheManager.reset();
  }

  async getKey(key: string) {
    return this.cacheManager.get(key);
  }
}
