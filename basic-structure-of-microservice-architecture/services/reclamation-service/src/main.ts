import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);

  // Load the configuration before initializing anything else
  await configService.loadConfig();

  const port = configService.get('server.port') || 3000;
  await app.listen(port);
  console.log(`Reclamation service running on port ${port}`);
}
bootstrap();
