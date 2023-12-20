import { GlobalCacheModule } from '@libs/cache';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './src/filters/all-exceptions.filter';
import { LoggingInterceptor } from './src/interceptors/logging.interceptor';
import { AppLoggerModule } from './src/logger/logger.module';

@Module({
  imports: [AppLoggerModule, GlobalCacheModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class CoreModule {}
