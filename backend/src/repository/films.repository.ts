import { FilmDto } from 'src/common/dto/film.dto';
import { SessionDto } from 'src/common/dto/session.dto';
import { SeatReservation } from 'src/common/seat-reservation';

export type BookSeatResult =
  | { status: 'booked'; session: SessionDto }
  | { status: 'film-not-found' }
  | { status: 'session-not-found' }
  | { status: 'seat-out-of-bounds' }
  | { status: 'seat-taken' };

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findSchedule(filmId: string): Promise<SessionDto[] | null>;
  abstract bookSeat(reservation: SeatReservation): Promise<BookSeatResult>;
  abstract releaseSeat(reservation: SeatReservation): Promise<void>;
}
