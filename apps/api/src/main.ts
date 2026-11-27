import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureApp } from './common/configure-app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  configureApp(app);
  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT', 3001));
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
