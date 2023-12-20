import {
  Controller,
  Delete,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('cache')
@ApiHeader({
  name: 'Token',
})
@Controller('cache')
@UseInterceptors(CacheInterceptor)
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Delete('reset')
  async resetAllCaches() {
    return await this.cacheService.resetAllCaches();
  }

  @Get('')
  async getKey(@Param('key') key: string) {
    return await this.cacheService.getKey(key);
  }
}
