import 'dotenv/config';

import { LoggerService, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DevLogger } from 'src/logger/dev.logger';
import { JsonLogger } from 'src/logger/json.logger';
import { TskvLogger } from 'src/logger/tskv.logger';
import { AppModule } from './app.module';

function getLogger(type: string): LoggerService {
  switch (type) {
    case 'dev':
      return new DevLogger();
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();

    default:
      return new DevLogger();
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  app.useLogger(getLogger(config.get<string>('LOGGER', 'dev')));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  await app.listen(Number(config.get<string>('PORT', '3000')));
}

void bootstrap();
