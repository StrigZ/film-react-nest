import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SeatReservation } from 'src/common/seat-reservation';
import { FilmDto } from 'src/films/dto/film.dto';
import { SessionDto } from 'src/films/dto/session.dto';
import {
  BookSeatResult,
  FilmsRepository,
} from 'src/repository/films.repository';
import { FilmEntity } from 'src/repository/mongo/entities/film.entity';
import { toFilmDto, toSessionDto } from 'src/repository/mongo/films.converters';

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

  async bookSeat(reservation: SeatReservation): Promise<BookSeatResult> {
    const { filmId, sessionId, row, seat } = reservation;
    const seatId = `${row}:${seat}`;

    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            rows: { $gte: row },
            seats: { $gte: seat },
            taken: { $ne: seatId },
          },
        },
      },
      { $push: { 'schedule.$.taken': seatId } },
    );

    const film = await this.filmModel
      .findOne({ id: filmId }, { schedule: { $elemMatch: { id: sessionId } } })
      .lean<Pick<FilmEntity, 'schedule'>>()
      .exec();

    if (!film) return { status: 'film-not-found' };

    // если сеанса нет, Mongo не вернёт поле schedule вовсе
    const session = film.schedule?.[0];
    if (!session) return { status: 'session-not-found' };

    if (result.matchedCount === 1) {
      return { status: 'booked', session: toSessionDto(session) };
    }
    if (row > session.rows || seat > session.seats) {
      return { status: 'seat-out-of-bounds' };
    }
    return { status: 'seat-taken' };
  }

  async releaseSeat({
    filmId,
    sessionId,
    row,
    seat,
  }: SeatReservation): Promise<void> {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $pull: { 'schedule.$.taken': `${row}:${seat}` } },
    );
  }
}
