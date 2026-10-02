import { TicketDto } from 'src/common/dto/create-order.dto';
import { FilmDto } from 'src/common/dto/film.dto';
import { SessionDto } from 'src/common/dto/session.dto';

export type BookSeatResult =
  | { status: 'booked'; session: SessionDto }
  | { status: 'film-not-found' }
  | { status: 'session-not-found' }
  | { status: 'seat-taken' }
  | { status: 'seat-out-of-bounds' };

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findSchedule(filmId: string): Promise<SessionDto[] | null>;
  abstract bookSeat(ticket: TicketDto): Promise<BookSeatResult>;
}
