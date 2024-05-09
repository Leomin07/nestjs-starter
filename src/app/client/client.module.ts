import { Module } from '@nestjs/common';
import { GlobalCacheModule } from 'src/libs/cache/cache.module';
import { JwtAuthenticationModule } from 'src/libs/jwt-authentication/jwt-authentication.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [JwtAuthenticationModule, AuthModule, GlobalCacheModule],
})
export class ClientModule {}
