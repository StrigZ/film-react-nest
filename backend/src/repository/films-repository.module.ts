import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmEntity, FilmSchema } from 'src/repository/entities/film.entity';
import { FilmsRepository } from 'src/repository/films.repository';
import { MongoFilmsRepository } from 'src/repository/mongo-films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FilmEntity.name, schema: FilmSchema }]),
  ],
  providers: [{ provide: FilmsRepository, useClass: MongoFilmsRepository }],
  exports: [FilmsRepository],
})
export class FilmsRepositoryModule {}
