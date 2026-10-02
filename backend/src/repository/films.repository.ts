import { FilmDto } from 'src/films/dto/film.dto';
import { SessionDto } from 'src/films/dto/session.dto';
import { TicketDto } from 'src/order/dto/create-order.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findSchedule(filmId: string): Promise<SessionDto[] | null>;
  abstract createOrder(tickets: TicketDto[]): Promise<void>;
}
