import { Module } from '@nestjs/common';
import { MongoRepositoryModule } from 'src/repository/mongo/mongo-repository.module';

@Module({
  imports: [MongoRepositoryModule],
  exports: [MongoRepositoryModule],
})
export class FilmsRepositoryModule {}
