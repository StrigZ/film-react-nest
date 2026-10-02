import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketDto } from 'src/common/dto/create-order.dto';
import { FilmDto } from '../common/dto/film.dto';
import { SessionDto } from '../common/dto/session.dto';
import { FilmEntity } from './entities/film.entity';
import { toFilmDto, toSessionDto } from './films.converters';
import { BookSeatResult, FilmsRepository } from './films.repository';

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

  async bookSeat(ticket: TicketDto): Promise<BookSeatResult> {
    const { film: filmId, session: sessionId, row, seat } = ticket;
    const seatId = `${row}:${seat}`;

    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        'schedule.id': sessionId,
        'schedule.taken': { $ne: seatId },
      },
      { $push: { 'schedule.$.taken': seatId } },
    );

    if (result.matchedCount > 0) return { status: 'booked' };

    const film = await this.filmModel
      .findOne({ id: filmId }, { schedule: 1 })
      .lean<Pick<FilmEntity, 'schedule'>>();

    if (!film) return { status: 'film-not-found' };

    const target = film.schedule.find((s) => s.id === sessionId);
    if (!target) return { status: 'session-not-found' };

    return { status: 'seat-taken' };
  }
}
