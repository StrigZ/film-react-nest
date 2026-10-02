import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketDto } from 'src/order/dto/create-order.dto';
import { FilmDto } from '../films/dto/film.dto';
import { SessionDto } from '../films/dto/session.dto';
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
  async createOrder(tickets: TicketDto[]): Promise<void> {
    for (const ticket of tickets) {
      await this.bookSeat(ticket);
    }
  }
  private async bookSeat(ticket: TicketDto): Promise<void> {
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

    if (result.matchedCount === 0) {
      const film = await this.filmModel
        .findOne({ id: filmId }, { schedule: 1 })
        .lean<Pick<FilmEntity, 'schedule'>>();

      if (!film) throw new NotFoundException(`Фильм ${filmId} не найден`);

      const target = film.schedule.find((s) => s.id === sessionId);
      if (!target)
        throw new NotFoundException(`Сессия ${sessionId} не найдена`);

      throw new ConflictException(`Место ${row}:${seat} занято`);
    }
  }
}
