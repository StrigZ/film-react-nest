import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  await app.listen(Number(config.get<string>('PORT', '3000')));
}

void bootstrap();
