import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER')!,
      url: configService.get<string>('DATABASE_URL')!,
      postgresUsername: configService.get<string>('DATABASE_USERNAME')!,
      postgresPassword: configService.get<string>('DATABASE_PASSWORD')!,
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  postgresUsername: string;
  postgresPassword: string;
}
