import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from 'src/core/module-option';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
})
export class AppModule {}
