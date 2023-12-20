import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from 'apps/app/src/config/module-option';
import { CoreModule } from 'libs/core/core.module';
import { DatabaseTypeormModule } from '@libs/database-typeorm';
import { GlobalCacheModule } from '@libs/cache';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    DatabaseTypeormModule,
    CoreModule,
    GlobalCacheModule,
  ],
})
export class AppModule {}
