import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';

@Module({
  imports: [ConfigModule.forRoot()], // Load env variables
  providers: [AppConfigService, ConfigService], // Register services
  exports: [AppConfigService, ConfigService], // Export services for other modules
})
export class AppConfigModule {}
