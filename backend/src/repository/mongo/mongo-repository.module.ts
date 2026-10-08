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
      useFactory: (config: ConfigService) => {
        const host = config.getOrThrow<string>('DATABASE_HOST');
        const port = config.getOrThrow<string>('DATABASE_PORT');
        const name = config.getOrThrow<string>('DATABASE_NAME');

        const uri = `mongodb://${host}:${port}/${name}`;

        return {
          uri,
        };
      },
    }),
    MongooseModule.forFeature([{ name: FilmEntity.name, schema: FilmSchema }]),
  ],
  providers: [{ provide: FilmsRepository, useClass: MongoFilmsRepository }],
  exports: [FilmsRepository],
})
export class MongoRepositoryModule {}
