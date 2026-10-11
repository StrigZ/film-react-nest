import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER')!,
      name: configService.get<string>('DATABASE_NAME')!,
      port: Number(configService.get<string>('DATABASE_PORT'))!,
      host: configService.get<string>('DATABASE_HOST')!,
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
  name: string;
  port: number;
  host: string;
  postgresUsername: string;
  postgresPassword: string;
}
