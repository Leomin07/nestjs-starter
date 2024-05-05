import { Module } from '@nestjs/common';
import { GlobalCacheModule } from 'src/libs/cache/cache.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [MemberModule, GlobalCacheModule],
})
export class ClientModule {}
