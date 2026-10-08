import { DynamicModule, Module } from '@nestjs/common';
import { MongoRepositoryModule } from 'src/repository/mongo/mongo-repository.module';
import { PostgresRepositoryModule } from 'src/repository/postgres/postgres-repository.module';

@Module({})
export class FilmsRepositoryModule {
  static register(): DynamicModule {
    switch (process.env.DATABASE_DRIVER) {
      case 'mongodb':
        return {
          module: FilmsRepositoryModule,
          imports: [MongoRepositoryModule],
          exports: [MongoRepositoryModule],
        };
      case 'postgres':
        return {
          module: FilmsRepositoryModule,
          imports: [PostgresRepositoryModule],
          exports: [PostgresRepositoryModule],
        };
      default:
        throw new Error('DATABASE_DRIVER is empty or invalid');
    }
  }
}
