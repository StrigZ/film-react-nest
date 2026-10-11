import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatReservation } from 'src/common/seat-reservation';
import { FilmDto } from 'src/films/dto/film.dto';
import { SessionDto } from 'src/films/dto/session.dto';
import {
  BookSeatResult,
  FilmsRepository,
} from 'src/repository/films.repository';
import { FilmEntity } from 'src/repository/postgres/entities/film.entity';
import { ScheduleEntity } from 'src/repository/postgres/entities/schedule.entity';
import { SeatReservationEntity } from 'src/repository/postgres/entities/seat-reservation.entity';
import { isUniqueViolation } from 'src/repository/postgres/errors';
import {
  toFilmDto,
  toSessionDto,
} from 'src/repository/postgres/films.converters';
import { Repository } from 'typeorm';

@Injectable()
export class PostgresFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    @InjectRepository(SeatReservationEntity)
    private readonly seatReservationRepository: Repository<SeatReservationEntity>,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();

    return films.map(toFilmDto);
  }

  async findSchedule(filmId: string): Promise<SessionDto[] | null> {
    const film = await this.filmRepository.findOne({ where: { id: filmId } });
    if (!film) return null;

    const schedule = await this.scheduleRepository.find({
      where: { film: { id: filmId } },
      relations: { taken: true },
    });

    return schedule.map(toSessionDto);
  }

  async bookSeat(reservation: SeatReservation): Promise<BookSeatResult> {
    const { filmId, sessionId, row, seat } = reservation;

    const session = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
      relations: { taken: true },
    });

    if (!session) {
      const film = await this.filmRepository.findOne({ where: { id: filmId } });
      if (!film) return { status: 'film-not-found' };
      return { status: 'session-not-found' };
    }

    if (row > session.rows || seat > session.seats) {
      return { status: 'seat-out-of-bounds' };
    }

    try {
      await this.seatReservationRepository.insert({
        scheduleId: sessionId,
        row,
        seat,
      });
      session.taken.push({ row, seat } as SeatReservationEntity);
    } catch (err) {
      if (isUniqueViolation(err)) return { status: 'seat-taken' };
      throw err;
    }

    return { status: 'booked', session: toSessionDto(session) };
  }

  async releaseSeat({ sessionId, row, seat }: SeatReservation): Promise<void> {
    await this.seatReservationRepository.delete({
      scheduleId: sessionId,
      row,
      seat,
    });
  }
}
