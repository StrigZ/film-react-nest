import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsRepository } from 'src/repository/films.repository';
import {
  FilmEntity,
  FilmSchema,
} from 'src/repository/mongo/entities/film.entity';
import { MongoFilmsRepository } from 'src/repository/mongo/mongo-films.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('DATABASE_URL'),
      }),
    }),
    MongooseModule.forFeature([{ name: FilmEntity.name, schema: FilmSchema }]),
  ],
  providers: [{ provide: FilmsRepository, useClass: MongoFilmsRepository }],
  exports: [FilmsRepository],
})
export class MongoRepositoryModule {}
