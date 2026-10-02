import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto } from './dto/film.dto';
import { SessionDto } from './dto/session.dto';
import { FilmEntity } from './entities/film.entity';
import { toFilmDto, toSessionDto } from './films.converters';
import { FilmsRepository } from './films.repository';

@Injectable()
export class MongoFilmsRepository extends FilmsRepository {
  constructor(
    @InjectModel(FilmEntity.name)
    private readonly filmModel: Model<FilmEntity>,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel
      .find({}, { schedule: 0 })
      .lean<Omit<FilmEntity, 'schedule'>[]>()
      .exec();

    return films.map(toFilmDto);
  }

  async findSchedule(filmId: string): Promise<SessionDto[] | null> {
    const film = await this.filmModel
      .findOne({ id: filmId }, { schedule: 1 })
      .lean<Pick<FilmEntity, 'schedule'>>()
      .exec();

    return film ? film.schedule.map(toSessionDto) : null;
  }
}
