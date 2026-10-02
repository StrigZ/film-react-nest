import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmEntity, FilmSchema } from './entities/film.entity';
import { FilmsController } from './films.controller';
import { FilmsRepository } from './films.repository';
import { FilmsService } from './films.service';
import { MongoFilmsRepository } from './mongo-films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FilmEntity.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    { provide: FilmsRepository, useClass: MongoFilmsRepository },
  ],
})
export class FilmsModule {}
